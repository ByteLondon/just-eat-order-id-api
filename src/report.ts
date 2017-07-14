import * as QueryStream from 'pg-query-stream'
import { stringify } from 'csv'
import { createWriteStream } from 'fs'
import * as Insights from './model/facebook-insights'
import { connect, query } from './model/core'
import {
  JOIN_ALL,
  updateMarketingObjective,
  selectObjectives
} from './model/report'

// ---------------------------------------------------------------
//maps fb objectives to marketing objectives
const marketingObjectives = (link: string, objective: string) => ({
  APP_INSTALLS: 'installs',
  BRAND_AWARENESS: 'awareness',
  CONVERSIONS: 'orders',
  EVENT_RESPONSES: 'engagement',
  LEAD_GENERATION: 'engagement',
  LEADS: 'engagement',
  LINK_CLICKS: linkClicks(link, objective), //special case, need to determine based on 'link' value
  MOBILE_APP_ENGAGEMENT: 'orders',
  MOBILE_APP_INSTALLS: 'installs',
  PRODUCT_CATALOG_SALES: 'orders',
  POST_ENGAGEMENT: 'engagement',
  REACH: 'awareness',
  VIDEO_VIEWS: 'awareness'
})

const linkClicks = (link: string, objective: string) => {
  if (!link) return null
  const visual = /facebook.com\[^[a-zA-Z0-9_.-]*$\/(videos|photos)/.test(link)
  const justeat = /just-eat.co.uk/.test(link)
  // const canvas = /fb.com\/canvas_doc/.test(link)
  // const ig = /instagram.com/.test(link)
  const app = /itunes.apple.com|play.google.com/.test(link)
  const chatbot = /fb.me/.test(link)
  //TODO: btas
  const appInstallOrOrder =
    objective == 'APP_INSTALLS' ? 'app installs' : 'orders'

  return visual
    ? 'awareness'
    : app
      ? appInstallOrOrder
      : chatbot ? 'engagement' : justeat ? 'orders' : 'orders'
}

interface Objective {
  adId: string
  objective: string
  link: string | null
}

export const updateMarketingObjectives = async () => {
  const objectives = await selectObjectives()
  return Promise.all(
    objectives.map((a: Objective) =>
      updateMarketingObjective([
        a.adId,
        marketingObjectives(a.link, a.objective)[a.objective]
      ])
    )
  )
}
// ---------------------------------------------------------------

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
      'marketing_objective',
      'ad_account',
      'post_id',
      'message',
      'permalink_url',
      'link',
      'type'
    ],
    header: true
  })

export const report = async () => {
  // await updateMarketingObjectives()
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
