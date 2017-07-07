import api, { checkStatusCode } from './util/api'
import * as config from '../config'
import { fetchPagedData } from './util/paged-data'

// https://developers.facebook.com/docs/marketing-api/reference/adgroup

export interface AdCreative {
  ad_id: string
  adcreative_id: string
  post_id: string
  instagram_url: string
}

export const fetchCreativeId = async (
  accessToken: string,
  adAccountId: string,
  since: number
): Promise<AdCreative[]> => {
  const qs = {
    params: {
      access_token: accessToken,
      fields: 'adcreatives,created_time,insights',
      since
    }
  }

  const results = await fetchPagedData(`/act_${adAccountId}/ads`, qs)
  console.log(results)
  console.log(results[0].insights)
  console.log(results[0].adcreatives.data)
  return results as AdCreative[]
}

export const fetchCreatives = async (
  accessToken: string,
  creativeId: string,
  since: number
): Promise<AdCreative[]> => {
  const qs = {
    params: {
      access_token: accessToken,
      fields: 'effective_object_story_id,instagram_permalink_url',
      since
    }
  }

  const results = await fetchPagedData(`/${creativeId}`, qs)
  console.log(results)
  return results as AdCreative[]
}

// https://developers.facebook.com/docs/marketing-api/reference/ad-creative
