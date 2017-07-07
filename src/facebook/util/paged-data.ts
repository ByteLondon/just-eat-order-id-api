import api, { checkStatusCode } from './api'
import { Insight } from '../types/insights'

interface Body {
  data: Insight[]
  paging: {
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
    since: any
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
    data = data.concat(body.data)
    if (body.paging && body.paging.next) {
      processPages(body.paging.next, qs, data, cb)
    } else {
      cb(null, data)
    }
  })
