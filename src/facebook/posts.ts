import api, { checkStatusCode } from './util/api'
import { Post } from './types/posts'
import * as config from '../config'
import { fetchPagedData } from './util/paged-data'
//https://developers.facebook.com/docs/graph-api/reference/v2.9/post

export const fetchCreatives = async (
  accessToken: string,
  postId: string,
  since: number
): Promise<Post[]> => {
  const qs = {
    params: {
      access_token: accessToken,
      fields: 'permalink_url,message,created_time,id',
      since
    }
  }

  const results = await fetchPagedData(`/Post/${postId}`, qs)
  console.log(results)
  return results as Post[]
}
