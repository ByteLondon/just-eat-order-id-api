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

export const JOIN_ALL = `select
  insights.ad_id, insights.ad_name, insights.adset_id, insights.adset_name, insights.campaign_id, insights.campaign_name, insights.objective, insights.ad_account,
  posts.post_id, posts.message, posts.permalink_url, posts.link, posts.type
  from facebook_insights insights full outer join facebook_creatives creatives on insights.ad_id = creatives.ad_id
  full outer join facebook_posts posts on creatives.post_id = posts.post_id;`
