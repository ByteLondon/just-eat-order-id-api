import { logger } from './logger'
import * as config from './config'
import { fetchInsights } from './facebook/insights'

process.on('unhandledRejection', (err, promise) => {
  console.log('unhandled rejection', err, { promise })
  // TODO: check why still getting unhandled rejection
  // logger.error('unhandled rejection', err, { promise })
})

const results = async () =>
  await fetchInsights(
    config.facebookAccessToken,
    '1411952492149453',
    '2017-06-29',
    '2017-07-03'
  )

results()
