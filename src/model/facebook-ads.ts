import { query, unpackFirstRow } from './core'
import { pickBy, isBoolean } from 'lodash'
import { Insight } from '../facebook/insights'

const UPSERT = `
  insert into facebook_ads
    (ad_id, ad_name, adset_name, adset_id, campaign_name, campaign_id, objective, date_start, date_stop, ad_account)
  values
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  on conflict (ad_id) do update set
    ad_id = coalesce(nullif(EXCLUDED.ad_id, ''), facebook_ads.ad_id),
    ad_name = coalesce(nullif(EXCLUDED.ad_name, ''), facebook_ads.ad_name),
    adset_name = coalesce(nullif(EXCLUDED.adset_name, ''), facebook_ads.adset_name),
    adset_id = coalesce(nullif(EXCLUDED.adset_id, ''), facebook_ads.adset_id),
    campaign_name = coalesce(nullif(EXCLUDED.campaign_name, ''), facebook_ads.campaign_name),
    campaign_id = coalesce(nullif(EXCLUDED.campaign_id, ''), facebook_ads.campaign_id),
    objective = coalesce(nullif(EXCLUDED.objective, ''), facebook_ads.objective),
    date_start = coalesce(nullif(EXCLUDED.date_start, ''), facebook_ads.date_start),
    date_stop = coalesce(nullif(EXCLUDED.date_stop, ''), facebook_ads.date_stop),
    ad_account = coalesce(nullif(EXCLUDED.ad_account, ''), facebook_ads.ad_account)
  returning *`

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
    adAccount
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
    adAccount
  ]
  return query(UPSERT, params).then(unpackFirstRow) as Promise<Insight>
}
