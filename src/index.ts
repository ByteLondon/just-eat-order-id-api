import { logger } from './logger'
import * as config from './config'
import { fetchInsights } from './facebook/insights'
import { fetchCreatives } from './facebook/posts'

process.on('unhandledRejection', (err, promise) => {
  console.log('unhandled rejection', err, { promise })
  // TODO: check why still getting unhandled rejection
  // logger.error('unhandled rejection', err, { promise })
})

const since = '2017-06-29'
const until = '2017-07-03'

const insights = async () =>
  await fetchInsights(
    config.facebookAccessToken,
    config.adAcountId.jeEngagement,
    since,
    until
  )

const posts = async () =>
  await fetchCreatives(
    config.facebookAccessToken,
    config.pageId.jeUk,
    Math.floor(Date.parse(since) / 1000)
  )

// insights()
posts()
