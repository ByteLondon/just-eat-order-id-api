import { databaseUrl } from '../config'
import { camelCase, mapKeys } from 'lodash'
import * as pg from 'pg'
import * as url from 'url'

import { PoolConfig } from 'pg'

const params = url.parse(databaseUrl)
const auth = params.auth.split(':')

const pool = new pg.Pool(
  {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: parseInt(params.port),
    database: params.pathname.split('/')[1],
    native: true,
    ssl: process.env.NODE_ENV === 'production',
    max: 10,
    idleTimeoutMillis: 60000
  } as PoolConfig
)

export const query = (sql: string, params: any[]): Promise<any> =>
  pool
    .query(sql, params)
    .then(res =>
      res.rows.map(row => mapKeys(row, (v, k: string) => camelCase(k)))
    )

export const unpackFirstRow = (res: any[]) =>
  new Promise((resolve, reject) => resolve(res[0]))

export const unpackValue = (name: string) => (res: any[]) =>
  new Promise((resolve, reject) => resolve(res[0][name]))

export const connect = cb => pool.connect(cb)
