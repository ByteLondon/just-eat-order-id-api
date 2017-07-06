import api, { checkStatusCode } from './util/api'
import { Insight } from './types/insights'
import * as config from '../config'
import * as qs from 'querystring'

//https://developers.facebook.com/docs/marketing-api/insights/fields/v2.9

const parameters = (since: string, until: string) =>
  qs.stringify({
    include_headers: false,
    level: 'ad',
    fields:
      'ad_id,ad_name,adset_name,adset_id,campaign_name,campaign_id,objective',
    time_range: { since, until }
  })

export const fetchInsights = (
  accessToken: string,
  adAccountId: string,
  since: string,
  until: string
) =>
  api
    .post(
      '',
      qs.stringify({
        access_token: accessToken,
        batch: JSON.stringify([
          {
            method: 'GET',
            relative_url: `v2.9/act_${adAccountId}/insights?${parameters(
              since,
              until
            )}`
          }
        ])
      })
    )
    .then(checkStatusCode)
