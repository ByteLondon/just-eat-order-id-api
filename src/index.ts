import { logger } from './logger'
import * as config from './config'
import { fetchInsights } from './facebook/insights'
import { fetchPosts } from './facebook/posts'
import { fetchCreatives, fetchCreativeId } from './facebook/creatives'
import * as Creatives from './model/facebook-creatives'
import * as async from 'async'
import { forIn } from 'lodash'

process.on('unhandledRejection', (err, promise) => {
  console.log('unhandled rejection', err, { promise })
  // TODO: check why still getting unhandled rejection
  // logger.error('unhandled rejection', err, { promise })
})

const since = '2017-05-06'
const until = '2017-07-07'

const posts = async () =>
  await fetchPosts(config.facebookAccessToken, config.page.jeUk, since)

/*There will be ad_ids in the facebook_creatives table which will not 
be in the facebook_insights table due to those ads being inactive */
const creative = async () => {
  forIn(config.adAcount, async (val: string) => {
    const data = await fetchCreativeId(config.facebookAccessToken, val, since)
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
  })
}

const insights = () => {
  forIn(config.adAcount, async (val: string) => {
    await fetchInsights(config.facebookAccessToken, val, since, until)
  })
}

// insights()
// posts()
creative()
