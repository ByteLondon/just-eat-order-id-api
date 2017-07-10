import api, { checkStatusCode } from './util/api'
import * as config from '../config'
import { fetchPagedData } from './util/paged-data'
import * as Creatives from '../model/facebook-creatives'

// https://developers.facebook.com/docs/marketing-api/reference/adgroup

export interface CreativeId {
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

export interface Creative {
  id: string
  effective_object_story_id: string
}

export const fetchCreativeId = async (
  accessToken: string,
  adAccountId: string,
  since: string
): Promise<CreativeId[]> => {
  const qs = {
    params: {
      access_token: accessToken,
      fields: 'adcreatives,created_time,insights,creative',
      since
    }
  }

  const results = await fetchPagedData(
    `/act_${adAccountId}/ads`,
    qs,
    since,
    null, //Don't add data to DB
    adAccountId
  )
  return results as CreativeId[]
}

// This function doesn't call fetchPagedData as it doesn't need to paginate
export const fetchCreatives = async (
  accessToken: string,
  creativeId: string,
  since: string
): Promise<Creative> => {
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
    .then((res: Creative) => res)
}

// https://developers.facebook.com/docs/marketing-api/reference/ad-creative
