import api, { checkStatusCode } from './util/api'
import { Insight } from './types/insights'
import * as config from '../config'
import * as qs from 'querystring'
import { fetchPagedData } from './util/paged-data'

//https://developers.facebook.com/docs/marketing-api/insights/fields/v2.9

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
  const results = await fetchPagedData(`act_${adAccountId}/insights`, qs)
  return results as Insight[]
}
