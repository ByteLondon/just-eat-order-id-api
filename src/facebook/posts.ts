import api, { checkStatusCode } from './util/api'
import { Post } from './types/posts'
//https://developers.facebook.com/docs/graph-api/reference/v2.9/post

const fetchCreatives = async (
  accessToken: string,
  postId: string,
  since: string
): Promise<Post[]> =>
  api
    .get(`/Post/${postId}`, {
      params: {
        access_token: accessToken,
        fields: 'permalink_url,message,created_time,id',
        since: Math.floor(Date.parse(since) / 1000)
      }
    })
    .then(checkStatusCode) as Promise<Post[]>
