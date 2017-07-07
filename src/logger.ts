import * as logfmt from 'logfmt'

const log = (at, msg, err, extra?) => {
  const data: any = { at, msg }
  if (err && err.message) {
    data.err = err.message
  }
  if (err && err.stack) {
    data.stack = err.stack
  }
  if (extra) {
    Object.assign(data, extra)
  }
  console.log(logfmt.stringify(data))
}

export const logger = {
  error: (msg, err, extra?) => log('error', msg, err, extra),
  warn: (msg, err?, extra?) => log('warn', msg, err, extra),
  info: (msg, extra?) => log('info', msg, false, extra),
  debug: (msg, extra?) => log('debug', msg, false, extra),
  asBunyanCompatible: () => ({
    // swap the param order to match the bunyan API
    error: (err, msg) => logger.error(msg, err),
    warn: (err, msg) => logger.warn(msg, err),
    info: (err, msg) => logger.info(msg, err),
    // ignore trace messages
    trace: () => undefined,
    child: () => logger.asBunyanCompatible()
  })
}
