import { query, unpackFirstRow } from './core'
import { pickBy, isBoolean, truncate } from 'lodash'
import { Post } from '../facebook/posts'

const DELETE_BEFORE_UPDATE = `delete from facebook_posts where post_id = $1`

const INSERT = `
  insert into facebook_posts (post_id, permalink_url, message, created_time, type, link, page_id)
  values
    ($1, $2, $3, $4, $5, $6, $7)`

export const update = (values): Promise<Post> => {
  let {
    id, //post_id
    permalink_url,
    message,
    created_time,
    type,
    link,
    page_id
  } = pickBy(values, v => v || isBoolean(v)) as any
  message = truncate(message, { length: 256 }) //Redshift DB converts text to varchar(256)
  const params = [id, permalink_url, message, created_time, type, link, page_id]
  query(DELETE_BEFORE_UPDATE, [id])
  return query(INSERT, params).then(unpackFirstRow) as Promise<Post>
}
