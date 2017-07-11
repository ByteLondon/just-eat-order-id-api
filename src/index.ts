import { logger } from './logger'
import * as config from './config'
import { fetchInsights } from './facebook/insights'
import { fetchPosts } from './facebook/posts'
import { fetchCreatives, fetchCreativeId } from './facebook/creatives'
import * as async from 'async'
import * as Creatives from './model/facebook-creatives'

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

const creative = async () => {
  const data = await fetchCreativeId(
    config.facebookAccessToken,
    config.adAcountId.jeEngagement,
    since
  )
  async.map(
    data,
    async (ad, next) => {
      const creative = await fetchCreatives(
        config.facebookAccessToken,
        ad.adcreatives.data[0].id,
        since
      )
      next(null, {
        ad_id: ad.id,
        post_id: creative.effective_object_story_id
      })
    },
    (err, results) => results.forEach(async a => await Creatives.insert(a))
  )
}

// insights()
// posts()
creative()
