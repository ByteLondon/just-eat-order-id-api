import { query, unpackFirstRow } from './core'
import { pickBy, isBoolean } from 'lodash'

const UPSERT_POSTS = `
  insert into table facebook_posts
    (post_id, 
    message,
    permalink_url,
    type,
    created_time,
    link,
    page_id)
  values
    ($1, $2, $3, $4, $5, $6, $7)
  on conflict (post_id) do update set
    post_id = coalesce(nullif(EXCLUDED.post_id, ''), facebook_posts.post_id),
    message = coalesce(nullif(EXCLUDED.message, ''), facebook_posts.message),
    permalink_url = coalesce(nullif(EXCLUDED.permalink_url, ''), facebook_posts.permalink_url),
    type = coalesce(nullif(EXCLUDED.type, ''), facebook_posts.type),
    created_time = coalesce(nullif(EXCLUDED.created_time, ''), facebook_posts.created_time),
    link = coalesce(nullif(EXCLUDED.link, ''), facebook_posts.link),
    page_id = coalesce(nullif(EXCLUDED.page_id, ''), facebook_posts.page_id)
  returning *`

interface FacebookPosts {
  postId: string
  message?: string
  permalinkUrl?: string
  type?: string
  createdTime?: string
  link?: string
  pageId?: string
}

export const insertAds = (values): Promise<FacebookPosts> => {
  const {
    postId
    message,
    permalinkUrl,
    type,
    createdTime,
    link,
    pageId
  } = pickBy(values, v => v || isBoolean(v)) as any
  const params = [
    postId
    message,
    permalinkUrl,
    type,
    createdTime,
    link,
    pageId
  ]
  return query(UPSERT_POSTS, params).then(unpackFirstRow) as Promise<FacebookPosts>
}
