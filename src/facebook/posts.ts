process.on('unhandledRejection', (err, promise) =>
  // logger.error('unhandled rejection', err, { promise })
  console.log('unhandled rejection', err, { promise })
)

import api, { checkStatusCode } from './util/api'
import { Post } from './types/posts'
import * as config from '../config'
//https://developers.facebook.com/docs/graph-api/reference/v2.9/post

const fetchCreatives = (
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

// const fetchCreatives = (accessToken: string, postId: string, since: string) =>
//   api
//     .get(`https://graph.facebook.com/v2.9/`, {
//       params: {
//         access_token: accessToken,
//         batch: [
//           {
//             method: 'POST',
//             relative_url: `/Post/${postId}`,
//             include_headers: false
//           }
//         ]
//         // fields: 'permalink_url,message,created_time,id',
//         // since: Math.floor(Date.parse(since) / 1000)
//       }
//     })
//     .then(checkStatusCode)
//     .catch(e => console.log(e))

fetchCreatives(config.facebookAccessToken, '340627227551', '2017-07-01')
