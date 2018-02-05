import { parse } from 'csv'
import { Writable } from 'stream'
import { createReadStream } from 'fs'

const sizes = new Map()

const main = async () => {
  for (const arg of process.argv.slice(2)) {
    console.log(arg)
    await new Promise(resolve =>
      createReadStream(arg, { encoding: 'utf-8' })
        .pipe(parse({ columns: true, delimiter: '\t', relax_column_count: true }))
        .pipe(
          new Writable({
            objectMode: true,
            write(chunk, enc, cb) {
              for (const k of Object.keys(chunk)) {
                const len = (chunk[k] || '').length
                sizes.set(k, Math.max(sizes.get(k) || 0, len))
                // if (k === 'Zip' && len > 1000) console.log(k, len, chunk[k])
              }
              cb()
            },
            final() {
              resolve()
            }
          })
        )
    )
  }
}

const report = () => {
  for (const [k, v] of sizes.entries()) {
    console.log(k, '=', v)
  }
}

main()
  .then(report)
  .catch(console.error)
