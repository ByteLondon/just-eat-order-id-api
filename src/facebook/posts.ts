import api, { checkStatusCode } from './util/api'
import { Post } from './types/posts'
import * as config from '../config'
import { fetchPagedData } from './util/paged-data'
//https://developers.facebook.com/docs/graph-api/reference/v2.9/post

//TODO: take the url out of the message and add it as a new field
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

  const results = await fetchPagedData(`/${postId}/posts`, qs)
  return results as Post[]
}
