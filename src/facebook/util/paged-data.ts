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

export const fetchPagedData = (url: string, q: QueryString) => {
  return new Promise((resolve, reject) =>
    processPages(url, q, [], (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  )
}

//TODO: add type for q
const processPages = (url: string, q: QueryString, data, cb) =>
  api.post('', q).then(checkStatusCode).then((body: Body) => {
    data = data.concat(body.data)
    if (body.paging && body.paging.next) {
      processPages(body.paging.next, q, data, cb)
    } else {
      cb(null, data)
    }
  })
