import api, { checkStatusCode } from './util/api'
import * as config from '../config'
import { fetchPagedData } from './util/paged-data'

// https://developers.facebook.com/docs/marketing-api/reference/adgroup

// export interface AdCreative {
//   ad_id: string
//   adcreative_id: string
//   post_id: string
//   instagram_url: string
// }

export interface AdCreativeId {
  adcreatives: {
    data: [
      {
        id: string
      }
    ]
  }
  created_time: string
  insights: {
    data: [
      {
        date_start: string
        date_stop: string
        impressions: string
        spend: string
        account_id: string
        campaign_id: string
        adset_id: string
        ad_id: string
      }
    ]
    paging: {
      cursors: {
        before: string
        after: string
      }
    }
  }
  creative: {
    id: string
  }
  id: string
}

export interface AdCreative {
  id: string
  effective_object_story_id: string
}

export const fetchCreativeId = async (
  accessToken: string,
  adAccountId: string,
  since: string
): Promise<AdCreativeId[]> => {
  const qs = {
    params: {
      access_token: accessToken,
      fields: 'adcreatives,created_time,insights,creative',
      since
    }
  }

  const results = await fetchPagedData(`/act_${adAccountId}/ads`, qs, since)
  return results as AdCreativeId[]
}

// This function doesn't call fetchPagedData as it doesn't need to paginate
export const fetchCreatives = async (
  accessToken: string,
  creativeId: string,
  since: string
): Promise<AdCreative> => {
  const qs = {
    params: {
      access_token: accessToken,
      fields: 'effective_object_story_id',
      since
    }
  }
  return api
    .get(`/${creativeId}`, qs)
    .then(checkStatusCode)
    .then(res => res) as Promise<AdCreative>
}

// https://developers.facebook.com/docs/marketing-api/reference/ad-creative
