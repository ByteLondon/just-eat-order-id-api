import { query, unpackFirstRow } from './core'
import { pickBy, isBoolean, camelCase } from 'lodash'
import { Insight } from '../facebook/insights'

const UPSERT = `
  insert into facebook_insights
    (ad_id, ad_name, adset_name, adset_id, campaign_name, campaign_id, objective, date_start, date_stop, ad_account)
  values
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  on conflict (ad_id) do update set
    ad_id = coalesce(nullif(EXCLUDED.ad_id, ''), facebook_insights.ad_id),
    ad_name = coalesce(nullif(EXCLUDED.ad_name, ''), facebook_insights.ad_name),
    adset_name = coalesce(nullif(EXCLUDED.adset_name, ''), facebook_insights.adset_name),
    adset_id = coalesce(nullif(EXCLUDED.adset_id, ''), facebook_insights.adset_id),
    campaign_name = coalesce(nullif(EXCLUDED.campaign_name, ''), facebook_insights.campaign_name),
    campaign_id = coalesce(nullif(EXCLUDED.campaign_id, ''), facebook_insights.campaign_id),
    objective = coalesce(nullif(EXCLUDED.objective, ''), facebook_insights.objective),
    date_start = EXCLUDED.date_start,
    date_stop = EXCLUDED.date_stop,
    ad_account = coalesce(nullif(EXCLUDED.ad_account, ''), facebook_insights.ad_account)
  returning *`

const SELECT_OBJECTIVE = `select ad_id, objective from facebook_insights`

export const insert = (values): Promise<Insight> => {
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
  return query(UPSERT, params).then(unpackFirstRow) as Promise<Insight>
}
