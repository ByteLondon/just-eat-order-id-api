import * as QueryStream from 'pg-query-stream'
import { stringify } from 'csv'
import { createWriteStream } from 'fs'
import { connect } from './model/core'

export const JOIN = `select
  insights.ad_id, insights.ad_name, insights.adset_id, insights.adset_name, insights.campaign_id, insights.campaign_name, insights.objective, insights.ad_account,
  posts.post_id, posts.message, posts.permalink_url, posts.link, posts.type
  from facebook_insights insights full outer join facebook_creatives creatives on insights.ad_id = creatives.ad_id
  full outer join facebook_posts posts on creatives.post_id = posts.post_id;`

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
    const query = new QueryStream(JOIN)
    const stream = client.query(query)
    //release the client when the stream is finished
    stream.on('end', done)
    stream
      .pipe(toCSV())
      .pipe(createWriteStream(`data.csv`), { defaultEncoding: 'utf-8' })
  })
}
