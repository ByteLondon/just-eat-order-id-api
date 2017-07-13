import * as QueryStream from 'pg-query-stream'
import { stringify } from 'csv'
import { createWriteStream } from 'fs'
import { connect, JOIN_ALL } from './model/core'
import * as Insights from './model/facebook-insights'

//maps fb objectives to marketing objectives
const marketingObjectives = {
  APP_INSTALLS: 'installs',
  BRAND_AWARENESS: 'awareness',
  CONVERSIONS: 'orders',
  EVENT_RESPONSES: 'engagement',
  LEAD_GENERATION: 'engagement',
  LEADS: 'engagement',
  LINK_CLICKS: '', //special case, need to determine based on 'link' value
  MOBILE_APP_ENGAGEMENT: 'orders',
  MOBILE_APP_INSTALLS: 'installs',
  PRODUCT_CATALOG_SALES: 'orders',
  POST_ENGAGEMENT: 'engagement',
  REACH: 'awareness',
  VIDEO_VIEWS: 'awareness'
}

const linkClicks = () => {}

export const insightObjectives = async () => {
  const objectives = await Insights.selectObjective()
}

const toCSV = () =>
  stringify({
    columns: [
      'ad_id',
      'ad_name',
      'adset_name',
      'adset_id',
      'campaign_id',
      'campaign_name',
      'objective',
      'ad_account',
      'post_id',
      'message',
      'permalink_url',
      'link',
      'type'
    ],
    header: true
  })

export const report = () => {
  connect((err, client, done) => {
    if (err) throw err
    const query = new QueryStream(JOIN_ALL)
    const stream = client.query(query)
    //release the client when the stream is finished
    stream.on('end', done)
    stream
      .pipe(toCSV())
      .pipe(createWriteStream(`data.csv`), { defaultEncoding: 'utf-8' })
  })
}
