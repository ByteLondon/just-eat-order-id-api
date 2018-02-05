import { parse, stringify } from 'csv'
import { Transform, Writable } from 'stream'
import { createReadStream, appendFileSync } from 'fs'
import { parse as parsePath } from 'path'

const columns = [
  'reporting_starts',
  'reporting_ends',
  'account_id',
  'campaign_id',
  'ad_set_id',
  'ad_id',
  'account_name',
  'campaign_name',
  'ad_set_name',
  'ad_name',
  'amount_spent_gbp',
  'impressions',
  'all_clicks',
  'video_views_3sec',
  'link_clicks',
  'outbound_clicks',
  'page_engagement_on_ad'
]

const stat_columns = [
  'reporting_starts',
  'reporting_ends',
  'ad_id',
  'stat',
  'days_after',
  'after_viewing',
  'after_clicking'
]

const transform = () =>
  new Transform({
    objectMode: true,
    transform(chunk, enc, cb) {
      const ad_id = chunk['Ad ID']
      if (!ad_id || ad_id === '') return cb()
      cb(null, {
        reporting_starts: chunk['Reporting starts'],
        reporting_ends: chunk['Reporting ends'],
        account_id: chunk['Account ID'],
        campaign_id: chunk['Campaign ID'],
        ad_set_id: chunk['Ad set ID'],
        ad_id,
        account_name: chunk['Account name'],
        campaign_name: chunk['Campaign name'],
        ad_set_name: chunk['Ad set name'],
        ad_name: chunk['Ad name'],
        amount_spent_gbp: chunk['Amount spent (GBP)'],
        impressions: chunk['Impressions'],
        all_clicks: chunk['Clicks (all)'],
        video_views_3sec: chunk['3-second video views'],
        link_clicks: chunk['Link clicks'],
        outbound_clicks: chunk['Outbound clicks'],
        p: chunk['Page engagement [On ad]']
      })
    }
  })

const statNames = ['Page engagement', 'Mobile app installs', 'Website purchases', 'Mobile app purchases']

const transformStats = () =>
  new Transform({
    objectMode: true,
    transform(chunk, enc, cb) {
      const ad_id = chunk['Ad ID']
      if (!ad_id || ad_id === '') return cb()
      for (const stat of statNames) {
        for (const days of [1, 7, 28]) {
          this.push({
            reporting_starts: chunk['Reporting starts'],
            reporting_ends: chunk['Reporting ends'],
            ad_id,
            stat,
            days_after: days,
            after_viewing: chunk[`${stat} [${days} Days After Viewing]`],
            after_clicking: chunk[`${stat} [${days} Days After Clicking]`]
          })
        }
      }
      cb()
    }
  })

const append = (fileName, resolve) =>
  new Writable({
    write(chunk, encoding, cb) {
      appendFileSync(fileName, chunk, { encoding })
      cb()
    },
    final() {
      resolve()
    }
  })

const main = async () => {
  // only add a header to the first file
  let header = true
  for (const arg of process.argv.slice(3)) {
    console.log(arg)
    await new Promise(resolve => {
      const stream = createReadStream(arg, { encoding: 'utf-8' }).pipe(parse({ columns: true, delimiter: ',' }))
      stream
        .pipe(transform())
        .pipe(stringify({ columns, delimiter: '|', header }))
        .pipe(append(process.argv[2], resolve))
      const { dir, name, ext } = parsePath(process.argv[2])
      stream
        .pipe(transformStats())
        .pipe(stringify({ columns: stat_columns, delimiter: '|', header }))
        .pipe(append(`${dir}${dir.length === 0 ? '' : '/'}${name}_stats${ext}`, resolve))
    }).then(() => (header = false))
  }
}

main().catch(console.error)
