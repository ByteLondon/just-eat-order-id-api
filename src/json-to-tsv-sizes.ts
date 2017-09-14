import { createReadStream } from 'fs'
import { createGunzip } from 'zlib'
import { createInterface } from 'readline'
import { stringify } from 'csv'

const inpath = '/home/just-eat-dpa/writeable/uk_events_facebookorderattribution_filecompositefinal.json.gz'

const attributionColumns = {
  conversion_device: 0,
  RaisingComponent: 0,
  order_id: 0,
  TimeStamp: 0,
  app_id: 0,
  order_timestamp: 0,
  attribution_type: 0,
  Id: 0,
  Tenant: 0
}

const impressionColumns = {
  Id: 0,
  impression_timestamp: 0,
  ad_id: 0,
  account_id: 0,
  impression_cost: 0,
  adset_id: 0,
  campaign_id: 0,
  click_cost: 0,
  action_type: 0,
  device: 0,
  placement: 0
}

const gunzip = createGunzip()

createInterface({ input: gunzip })
  .on('line', line => {
    const data = JSON.parse(line)
    Object.keys(attributionColumns).forEach(
      key => (attributionColumns[key] = Math.max(attributionColumns[key], data[key] ? data[key].length : 0))
    )
    for (const impression of data.attributions) {
      Object.keys(impressionColumns).forEach(
        key => (impressionColumns[key] = Math.max(impressionColumns[key], impression[key] ? impression[key].length : 0))
      )
    }
  })
  .on('close', () => {
    console.log(attributionColumns)
    console.log(impressionColumns)
  })

createReadStream(inpath, { autoClose: true })
  .on('data', data => gunzip.write(data))
  .on('end', () => gunzip.end())
