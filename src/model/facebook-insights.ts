import { query, unpackFirstRow } from './core'
import { pickBy, isBoolean, camelCase } from 'lodash'
import { Insight } from '../facebook/insights'

const DELETE_BEFORE_UPDATE = `delete from facebook_insights where ad_id = $1`

// const INSERT = `
//   insert into facebook_insights
//     (ad_id, ad_name, adset_name, adset_id, campaign_name, campaign_id, objective, date_start, date_stop, ad_account)
//   values
//     ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`

const INSERT = `
  insert into facebook_insights
    (ad_id, ad_name, adset_name, adset_id, campaign_name, campaign_id, objective, date_start, date_stop, ad_account)
  select cast($1 as varchar), $2, $3, $4, $5, $6, $7, $8, $9, $10
  where not exists (select ad_id from facebook_insights where ad_id = $1)`

const SELECT_OBJECTIVE = `select ad_id, objective from facebook_insights`

export const update = (values): Promise<Insight> => {
  const {
    ad_id,
    ad_name,
    adset_name,
    adset_id,
    campaign_name,
    campaign_id,
    objective,
    date_start,
    date_stop,
    ad_account
  } = pickBy(values, v => v || isBoolean(v)) as any
  const params = [
    ad_id,
    ad_name,
    adset_name,
    adset_id,
    campaign_name,
    campaign_id,
    objective,
    date_start,
    date_stop,
    ad_account
  ]

  query(DELETE_BEFORE_UPDATE, [ad_id])
  return query(INSERT, params).then(unpackFirstRow) as Promise<Insight>
}
