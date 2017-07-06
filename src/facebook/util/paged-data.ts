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

interface QueryString {
  access_token: string
  batch: [
    {
      method: 'GET' | 'POST'
      relative_url: string
      since: string
      until: string
    }
  ]
}

export const fetchPagedData = (url: string, qs?) => {
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

const processPages = (url: string, qs, data, cb) =>
  api.get(url, qs).then(checkStatusCode).then((body: Body) => {
    data = data.concat(body.data)
    if (body.paging && body.paging.next) {
      processPages(body.paging.next, qs, data, cb)
    } else {
      cb(null, data)
    }
  })
