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
    since: number
  }
}

// type EmptyArr = []
// type Data = Insight[]

export const fetchPagedData = (url: string, qs?: InsightsQs | PostsQs) => {
  return new Promise((resolve, reject) =>
    processPages(url, qs, [], (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  )
}

const processPages = (url: string, qs: InsightsQs | PostsQs, data, cb) =>
  api.get(url, qs).then(checkStatusCode).then((body: Body) => {
    if (body.error) {
      if (body.error.code === 17 && body.error.is_transient) {
        console.log('rate limit at', new Date())
        setTimeout(() => processPages(url, qs, data, cb), 500000)
      } else {
        cb(new Error(body.error))
      }
    } else if (body.data) {
      data = data.concat(body.data)
      if (body.paging && body.paging.next) {
        setImmediate(() => processPages(body.paging.next, qs, data, cb))
      } else {
        cb(null, data)
      }
    } else {
      cb(new Error('no data was recieved from API'))
    }
  })
