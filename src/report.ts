import * as QueryStream from 'pg-query-stream'
import { stringify } from 'csv'
import { createWriteStream } from 'fs'
import * as Insights from './model/facebook-insights'
import { connect, query } from './model/core'
import {
  JOIN_ALL,
  updateMarketingObjective,
  updatePostFormat,
  selectObjectives,
  selectTypes,
  selectAdNames,
  updateAdFormat
} from './model/report'
import { PostType } from './facebook/posts'
import { keys, pickBy } from 'lodash'

//maps fb objectives to marketing objectives
const marketingObjectives = (link: string) => ({
  APP_INSTALLS: 'installs',
  BRAND_AWARENESS: 'awareness',
  CONVERSIONS: 'orders',
  EVENT_RESPONSES: 'engagement',
  LEAD_GENERATION: 'engagement',
  LEADS: 'engagement',
  LINK_CLICKS: linkClicks(link), //special case, need to determine based on 'link' value
  MOBILE_APP_ENGAGEMENT: 'orders',
  MOBILE_APP_INSTALLS: 'installs',
  PRODUCT_CATALOG_SALES: 'orders',
  POST_ENGAGEMENT: 'engagement',
  REACH: 'awareness',
  VIDEO_VIEWS: 'awareness'
})

const links = (link: string) => ({
  photos: /facebook.com\/[A-Za-z0-9]+\/photos/.test(link),
  videos: /facebook.com\/[A-Za-z0-9]+\/videos/.test(link),
  justeat: /just-eat.co.uk/.test(link),
  canvas: /fb.com\/canvas_doc/.test(link),
  instagram: /instagram.com/.test(link),
  app: /itunes.apple.com|play.google.com/.test(link),
  chatbot: /fb.me/.test(link),
  btas: /thebtas.co.uk/.test(link)
})

//exported for tests
export const linkClicks = (link: string) => {
  if (!link) return null
  const {
    videos,
    photos,
    app,
    chatbot,
    canvas,
    btas,
    instagram,
    justeat
  } = links(link)
  return videos || photos
    ? 'awareness'
    : app
      ? 'orders/app installs'
      : chatbot || canvas || btas || instagram
        ? 'engagement'
        : justeat ? 'orders' : 'orders'
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
        marketingObjectives(a.link)[a.objective]
      ])
    )
  )
}

interface PostFormat {
  adName?: string
  postId: string
  type: PostType
  link: string | null
}

export const updatePostFormats = async () => {
  const types = await selectTypes()
  return Promise.all(
    types.map((a: PostFormat) =>
      updatePostFormat([a.postId, postFormat(a.link, a.type, a.adName)])
    )
  )
}

const clean = name => name.toLowerCase().replace(/\s+/g, '').replace(/_/g, '')
const carousel = (adName, regex) => (adName ? regex.test(clean(adName)) : null)

const formats = [
  'image',
  'video',
  'carousel',
  'link',
  'status',
  'offer',
  'photos',
  'videos',
  'event',
  'canvas',
  'leadform',
  'appinstall',
  'instagram'
]

// const assetVolumn = adName =>
//   adName.includes('carousel') ? 'carousel' : 'single'

export const adFormat = (adName: string) =>
  formats.filter((a: string) => clean(adName).includes(a))

export const updateAdFormats = async () => {
  const ads = await selectAdNames()
  return Promise.all(ads.map(a => updateAdFormat([a.adId, adFormat(a.adName)])))
}

//exported for tests
export const postFormat = (link: string, type: PostType, adName: string) => {
  if (!type) return null
  const imageCarousel = carousel(adName, /imagecarousel/)
  const videoCarousel = carousel(adName, /videocarousel/)
  // 👇 This doesn't ignore /videocarousel/ or /imagecarousel/ but they would be caught earlier in the ternary
  const someCarousel = carousel(adName, /carousel/)
  if (type == 'link') {
    const linkType = keys(pickBy(links(link)))
    return `link${linkType.length > 0 ? ', ' + linkType : ''}${imageCarousel
      ? ', image carousel'
      : videoCarousel ? ', video carousel' : someCarousel ? ', carousel' : ''}`
  } else {
    return type
  }
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
      'marketing_objective',
      'post_format',
      'ad_account',
      'post_id',
      'message',
      'permalink_url',
      'link',
      'type'
    ],
    header: true
  })

// const toCSV = () =>
//   stringify({
//     columns: ['ad_id', 'freq'],
//     header: true
//   })

export const report = async () => {
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
