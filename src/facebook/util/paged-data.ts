import api, { checkStatusCode } from './api'
import { Insight } from '../insights'
import { Post } from '../posts'

interface Body {
  error?: any
  data?: Insight[] | Post[]
  paging?: {
    cursors: {
      before: string
      after: string
    }
    next: string
  }
}

interface InsightsQs {
  params: {
    access_token: string
    level: string
    fields: string
    time_range: { since: string; until: string }
  }
}

interface PostsQs {
  params: {
    access_token: string
    fields: string
    since?: string | number
  }
}

// There seems to be a bug with since on some endpoints so the API returns all data regardless of since date
// https://developers.facebook.com/bugs/1706964106271869/ so have to check using created_time for the creative endpoints
const isLaterThanSinceDate = (data, since) => {
  const lastItem = data.length - 1
  return data[0].hasOwnProperty('created_time')
    ? Date.parse(data[lastItem].created_time) > Date.parse(since)
    : false
}

export const fetchPagedData = (
  url: string,
  qs: InsightsQs | PostsQs,
  since: string
) => {
  return new Promise((resolve, reject) =>
    processPages(url, qs, since, [], (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  )
}

const processPages = (
  url: string,
  qs: InsightsQs | PostsQs,
  since: string,
  data,
  cb
) =>
  api.get(url, qs).then(checkStatusCode).then((body: Body) => {
    if (body.error) {
      if (body.error.code === 17 && body.error.is_transient) {
        console.log('rate limit at', new Date())
        setTimeout(() => processPages(url, qs, since, data, cb), 600000)
      } else {
        cb(new Error(body.error))
      }
    } else if (body.data) {
      data = data.concat(body.data)
      if (
        body.paging &&
        body.paging.next &&
        isLaterThanSinceDate(body.data, since)
      ) {
        setImmediate(() => processPages(body.paging.next, qs, since, data, cb))
      } else {
        cb(null, data)
      }
    } else {
      cb(new Error('no data was recieved from API'))
    }
  })
