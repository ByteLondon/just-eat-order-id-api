import api, { checkStatusCode } from './api'
import { Insight } from '../insights'
import { Post } from '../posts'
import { CreativeId } from '../creatives'
import * as Ads from '../../model/facebook-insights'
import * as Posts from '../../model/facebook-posts'
import * as Creatives from '../../model/facebook-creatives'

interface Body {
  error?: any
  data?: Insight[] & Post[] & CreativeId[]
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
    ad_format?: string
    since?: string | number
  }
}

/* There seems to be a bug with since on some endpoints so the API returns all data regardless of since date
* https://developers.facebook.com/bugs/1706964106271869/ so have to check using created_time for the creative endpoints
-- exported for tests */
export const determinePagination = (body, since) => {
  const data = body.data
  if (body.paging && body.paging.next) {
    if (data[0].hasOwnProperty('created_time')) {
      const lastItem = data.length - 1
      return Date.parse(data[lastItem].created_time) > Date.parse(since)
    } else {
      return true
    }
  } else {
    return false
  }
}

type Table = 'insights' | 'posts' | 'creatives'

export const fetchPagedData = async (
  url: string,
  qs: InsightsQs | PostsQs,
  since: string,
  table: Table,
  objectId: string
) => {
  return new Promise(
    async (resolve, reject) =>
      await processPages(url, qs, since, table, objectId, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
  )
}

const insertData = async (
  table: Table,
  objectId: string,
  data: (CreativeId & Insight & Post)[]
) => {
  data.forEach(async (a: CreativeId & Insight & Post) => {
    if (objectId) {
      if (table == 'insights') {
        const values = Object.assign({ ad_account: objectId }, a)
        const ads = await Ads.update(values)
        return ads
      } else if (table == 'posts') {
        const values = Object.assign({ page_id: objectId }, a)
        const posts = await Posts.update(values)
        return posts
      } else if (table == 'creatives') {
        const values = {
          ad_id: a.adcreatives.data[0].id,
          post_id: a.adcreatives.data[0].effective_object_story_id
        }
        const creatives = await Creatives.update(values)
        return creatives
      }
    }
  })
}

const processPages = async (
  url: string,
  qs: InsightsQs | PostsQs,
  since: string,
  table: Table,
  objectId: string,
  cb
) =>
  api.get(url, qs).then(checkStatusCode).then(async (body: Body | any) => {
    if (body.error) {
      if (body.error.code === 17 && body.error.is_transient) {
        console.log('rate limit at', new Date())
        setTimeout(
          () => processPages(url, qs, since, table, objectId, cb),
          600000
        )
      } else {
        cb(new Error(body.error))
      }
    } else if (body.data) {
      if (table) {
        await insertData(table, objectId, body.data)
      }
      if (determinePagination(body, since)) {
        setImmediate(() =>
          processPages(body.paging.next, qs, since, table, objectId, cb)
        )
      } else {
        cb(null, body.data)
      }
    } else {
      cb(new Error('no data was recieved from API'))
    }
  })
