import api, { checkStatusCode } from './util/api'
import * as config from '../config'
import { fetchPagedData } from './util/paged-data'
//https://developers.facebook.com/docs/graph-api/reference/v2.9/post

export interface Post {
  id: string
  name: string
  message: string
  permalink_url: string
  type: string // enum{link, status, photo, video, offer}
  created_time: string // datetime
  link: string
}

export const fetchPosts = async (
  accessToken: string,
  postId: string,
  since: string
): Promise<Post[]> => {
  const qs = {
    params: {
      access_token: accessToken,
      fields: 'permalink_url,message,created_time,id,type,link',
      since
    }
  }

  const results = await fetchPagedData(`/${postId}/posts`, qs, since)
  return results as Post[]
}
