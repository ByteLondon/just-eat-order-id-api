import { logger } from './logger'
import * as config from './config'
import { fetchInsights } from './facebook/insights'
import { fetchPosts } from './facebook/posts'
import { fetchCreatives, fetchCreativeId } from './facebook/adcreatives'
import * as async from 'async'

process.on('unhandledRejection', (err, promise) => {
  console.log('unhandled rejection', err, { promise })
  // TODO: check why still getting unhandled rejection
  // logger.error('unhandled rejection', err, { promise })
})

const since = '2017-06-25'
const until = '2017-07-07'

const insights = async () =>
  await fetchInsights(
    config.facebookAccessToken,
    config.adAcountId.jeEngagement,
    since,
    until
  )

const posts = async () =>
  await fetchPosts(config.facebookAccessToken, config.pageId.jeUk, since)

const creatives = async () =>
  await fetchCreatives(config.facebookAccessToken, '23842635499520745', since)

const creativeId = async () =>
  await fetchCreativeId(
    config.facebookAccessToken,
    config.adAcountId.jeEngagement,
    since
  )

const c = async () => {
  const data = await fetchCreativeId(
    config.facebookAccessToken,
    config.adAcountId.jeEngagement,
    since
  )
  async.map(
    data,
    async (ad, next) => {
      const res = await fetchCreatives(
        config.facebookAccessToken,
        ad.adcreatives.data[0].id,
        since
      )
      // console.log(res)
      next(null, res)
    },
    (err, res) => console.log('RES: ', res)
  )
}

// insights()
// posts()
// creativeId()
creatives()
// c()
