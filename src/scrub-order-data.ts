import { parse, stringify } from 'csv'
import { Transform } from 'stream'

const postcodeRE = /(?:([a-z]{2}\d[a-z])\s*(\d[a-z]{2}))|(?:([a-z]\d[a-z])\s*(\d[a-z]{2}))|(?:([a-z]\d)\s*(\d[a-z]{2}))|(?:([a-z]\d{2})\s*(\d[a-z]{2}))|(?:([a-z]{2}\d)\s*(\d[a-z]{2}))|(?:([a-z]{2}\d{2})\s*(\d[a-z]{2}))|(?:([a-z]{1,2}\d[a-z]))|(?:([a-z]\d\d?))|(?:([a-z]{2}\d\d?))/i

class Scrubber extends Transform {
  discarded: number
  constructor() {
    super({ objectMode: true })
    this.discarded = 0
  }
  _transform(chunk: Array<any>, encoding, cb) {
    // if the row is too short discard it
    if (chunk.filter(a => a.length !== 0).length < 10) {
      ++this.discarded
      return cb(null)
    }

    // if it's too long assume that the extra fields are all adress info and smuch them together
    const scrubbed =
      chunk.length === 10
        ? chunk
        : [...chunk.slice(0, 5), chunk.slice(5, chunk.length - 4).join(' '), ...chunk.slice(chunk.length - 4)]

    // then look for postcodes and normalize them
    const match = postcodeRE.exec(scrubbed[5])
    scrubbed[5] = match && match.slice(1).filter(a => a).join(' ').toUpperCase()
    cb(null, scrubbed)
  }
}

// use this by piping the data through it

const scrubber = new Scrubber()

process.stdin
  .pipe(parse({ relax: true, relax_column_count: true }))
  .pipe(scrubber)
  .pipe(stringify())
  .pipe(process.stdout)
  .on('close', () => console.log(`discarded ${scrubber.discarded} records`))
