import { createReadStream, createWriteStream } from 'fs'
import { createGunzip } from 'zlib'
import { createInterface } from 'readline'
import { stringify } from 'csv'

const inpath = '/home/just-eat-dpa/writeable/uk_events_facebookorderattribution_filecompositefinal.json.gz'
const encoding = 'utf-8'

const toCSV = (columns: string[]) => stringify({ columns, delimiter: '\t', header: true })

const attributionColumns = [
  'conversion_device',
  'RaisingComponent',
  'order_id',
  'TimeStamp',
  'app_id',
  'order_timestamp',
  'attribution_type',
  'Id',
  'Tenant'
]
const attributions = toCSV(attributionColumns)
attributions.pipe(createWriteStream('new_attributions.tsv', { encoding }))

const impressionColumns = [
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
]
const impressions = toCSV(['Id'].concat(impressionColumns))
impressions.pipe(createWriteStream('new_impressions.tsv', { encoding }))

createInterface({
  input: createReadStream(inpath, { autoClose: true }).pipe(createGunzip())
}).on('line', line => {
  const data = JSON.parse(line)
  attributions.write(attributionColumns.map(col => data[col]))
  for (const impression of data.attributions) {
    impressions.write([data.Id].concat(impressionColumns.map(col => impression[col])))
  }
})
