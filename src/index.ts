import { logger } from './logger'
import * as config from './config'
import { fetchInsights } from './facebook/insights'
import { fetchPosts } from './facebook/posts'
import { fetchCreatives, FetchCreatives } from './facebook/creatives'
import * as Creatives from './model/facebook-creatives'
import { report, updateMarketingObjectives, updatePostFormats } from './report'
import * as async from 'async'
import { forIn } from 'lodash'

process.on('unhandledRejection', (err, promise) => {
  console.log('unhandled rejection', err, { promise })
})

const params = {
  since: '2016-10-01',
  until: '2017-06-01'
}

interface Params {
  since: string
  until: string
}

const posts = async (params: Params) => {
  console.log('posts')
  await fetchPosts(config.facebookAccessToken, config.page.jeUk, params.since)
}

export const insights = (params: Params) => {
  console.log('insights')
  forIn(config.adAcount, async (val: string) => {
    await fetchInsights(
      config.facebookAccessToken,
      val,
      params.since,
      params.until
    )
  })
}

export const creatives = (params: Params) => {
  console.log('creatives')
  forIn(config.adAcount, async (val: string) => {
    await fetchCreatives(config.facebookAccessToken, val, params.since)
  })
}

// posts(params)
// insights(params)
// updateMarketingObjectives().then().catch(console.error)
// updatePostFormats().then().catch(console.error)
// report()
creatives(params)
