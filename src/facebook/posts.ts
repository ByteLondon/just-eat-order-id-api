import api, { checkStatusCode } from './util/api'
import * as config from '../config'
import { fetchPagedData } from './util/paged-data'
//https://developers.facebook.com/docs/graph-api/reference/v2.9/post

export interface Post {
  permalink_url: string
  id: string
  message: string
  created_time: string // datetime
  type: string // enum{link, status, photo, video, offer}
  link: string
  page_id?: string
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

  const results = await fetchPagedData(
    `/${postId}/posts`,
    qs,
    since,
    'posts',
    config.pageId.jeUk
  )
  console.log(results)
  return results as Post[]
}
