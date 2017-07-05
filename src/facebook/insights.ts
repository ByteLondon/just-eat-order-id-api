import api, { checkStatusCode } from './util/api'
import { Insight } from './types/insights'
//https://developers.facebook.com/docs/marketing-api/insights/fields/v2.9

const fetchInsights = async (
  accessToken: string,
  adAccountId: string,
  since: string,
  until: string
): Promise<Insight[]> =>
  api
    .get(`/act_${adAccountId}/insights`, {
      params: {
        access_token: accessToken,
        level: 'ad',
        fields:
          'ad_id,ad_name,adset_name,adset_id,campaign_name,campaign_id,objective',
        time_range: { since, until }
      }
    })
    .then(checkStatusCode) as Promise<Insight[]>
