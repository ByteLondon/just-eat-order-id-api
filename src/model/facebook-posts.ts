import { query, unpackFirstRow } from './core'
import { pickBy, isBoolean } from 'lodash'
import { Post } from '../facebook/posts'

const UPSERT = `
  insert into facebook_posts (post_id, permalink_url, message, created_time, type, link, page_id)
  values
    ($1, $2, $3, $4, $5, $6, $7)
  on conflict (post_id) do update set
    post_id = coalesce(nullif(EXCLUDED.post_id, ''), facebook_posts.post_id),
    message = coalesce(nullif(EXCLUDED.message, ''), facebook_posts.message),
    permalink_url = coalesce(nullif(EXCLUDED.permalink_url, ''), facebook_posts.permalink_url),
    type = coalesce(nullif(EXCLUDED.type, ''), facebook_posts.type),
    created_time = EXCLUDED.created_time,
    link = coalesce(nullif(EXCLUDED.link, ''), facebook_posts.link),
    page_id = coalesce(nullif(EXCLUDED.page_id, ''), facebook_posts.page_id)
  returning *`

export const insert = (values): Promise<Post> => {
  const {
    id,
    permalink_url,
    message,
    created_time,
    type,
    link,
    page_id
  } = pickBy(values, v => v || isBoolean(v)) as any
  const params = [id, permalink_url, message, created_time, type, link, page_id]
  return query(UPSERT, params).then(unpackFirstRow) as Promise<Post>
}
