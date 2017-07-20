import { parse, stringify } from 'csv'
import { Writable } from 'stream'

class Summarizer extends Writable {
  // counts are total, short, normal, long
  private counts: { [key: string]: [number, number, number, number] }
  constructor() {
    super({ objectMode: true })
    this.counts = {}
  }
  _write(chunk: Array<any>, encoding, cb) {
    const month = chunk[2].substring(0, 7)
    const count = this.counts[month] || [0, 0, 0, 0]
    count[0]++
    if (chunk.length < 10) count[1]++
    if ((chunk.length = 10)) count[2]++
    if (chunk.length > 10) count[3]++
    cb()
  }
  _final(cb) {
    for (const month of Object.keys(this.counts).sort()) {
      console.log(month, ...this.counts[month])
    }
  }
}

// use this by piping the data through it

process.stdin.pipe(parse({ relax: true, relax_column_count: true })).pipe(new Summarizer())
