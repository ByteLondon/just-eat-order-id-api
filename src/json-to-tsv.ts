import { createReadStream, createWriteStream } from 'fs'
import { createGunzip } from 'zlib'
import { createInterface } from 'readline'
import { stringify } from 'csv'

const inpath = process.argv.slice(-1)[0]
const encoding = 'utf-8'

const toCSV = (columns: string[]) => stringify({ columns, delimiter: '\t', header: true })

const attributions = toCSV([
  'conversion_device',
  'raising_component',
  'order_id',
  'timestamp',
  'app_id',
  'order_timestamp',
  'attribution_type',
  'id',
  'tenant'
])
attributions.pipe(createWriteStream('new_attributions.tsv', { encoding }))

const impressions = toCSV([
  'id',
  'impression_timestamp',
  'ad_id',
  'account_id',
  'impression_cost',
  'adset_id',
  'campaign_id',
  'click_cost',
  'action_type',
  'device',
  'placement'
])
impressions.pipe(createWriteStream('new_impressions.tsv', { encoding }))

createInterface({
  input: createReadStream(inpath, { autoClose: true }).pipe(createGunzip())
}).on('line', line => {
  const data = JSON.parse(line)

  attributions.write([
    data.conversion_device,
    data.RaisingComponent,
    data.order_id,
    data.TimeStamp && data.TimeStamp.slice(0, -4), // remove the trailing ' UTC' from timestamps
    data.app_id,
    data.order_timestamp && data.order_timestamp.slice(0, -4),
    data.attribution_type,
    data.Id,
    data.Tenant
  ])

  for (const impression of data.attributions) {
    impressions.write([
      data.Id,
      impression.impression_timestamp,
      impression.ad_id,
      impression.account_id,
      impression.impression_cost,
      impression.adset_id,
      impression.campaign_id,
      impression.click_cost,
      impression.action_type,
      impression.device,
      impression.placement
    ])
  }
})
