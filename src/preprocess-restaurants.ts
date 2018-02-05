import { parse, stringify } from 'csv'
import { Transform } from 'stream'

const columns = [
  'id',
  'title',
  'product_type',
  'link',
  'image_link',
  'availability_radius',
  'item_group_id',
  'stars',
  'ratings',
  'street_address',
  'city',
  'region',
  'postal_code',
  'latitude',
  'longitude'
]

process.stdin
  .pipe(parse({ columns: true, relax: true, delimiter: '\t' }))
  .pipe(
    new Transform({
      objectMode: true,
      transform(chunk: any, enc, cb) {
        const addr = JSON.parse(chunk.address)
        cb(null, {
          id: +chunk.id,
          title: chunk.title,
          product_type: chunk.product_type,
          link: chunk.link,
          image_link: chunk.image_link,
          availability_radius: chunk.availability_radius,
          item_group_id: chunk.item_group_id,
          stars: chunk.custom_label_2,
          ratings: chunk.custom_label_1,
          street_address: addr.street_address,
          city: addr.city,
          region: addr.region,
          postal_code: addr.postal_code,
          latitude: +addr.latitude,
          longitude: +addr.longitude
        })
      }
    })
  )
  .pipe(stringify({ columns, delimiter: '|', header: true }))
  .pipe(process.stdout)
