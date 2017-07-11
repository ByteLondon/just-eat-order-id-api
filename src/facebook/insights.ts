import api, { checkStatusCode } from './util/api'
import * as config from '../config'
import { fetchPagedData } from './util/paged-data'

//https://developers.facebook.com/docs/marketing-api/insights/fields/v2.9
export interface Insight {
  ad_id: string
  ad_name: string
  adset_name: string
  adset_id: string
  campaign_name: string
  campaign_id: string
  objective: string
  date_start: string
  date_stop: string
  ad_account?: string
}

export const fetchInsights = async (
  accessToken: string,
  adAccountId: string,
  since: string,
  until: string
): Promise<Insight[]> => {
  const qs = {
    params: {
      access_token: accessToken,
      level: 'ad',
      fields:
        'ad_id,ad_name,adset_name,adset_id,campaign_name,campaign_id,objective',
      time_range: { since, until }
    }
  }
  const results = await fetchPagedData(
    `act_${adAccountId}/insights`,
    qs,
    since,
    'insights',
    adAccountId
  )
  console.log(results)
  return results as Insight[]
}
