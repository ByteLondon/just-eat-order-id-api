import { query, unpackFirstRow } from './core'
import { pickBy, isBoolean } from 'lodash'
import { Creative } from '../facebook/creatives'

const DELETE_BEFORE_UPDATE = `delete from facebook_creatives where ad_id = $1`

const INSERT = `
  insert into facebook_creatives
  (ad_id, post_id) values ($1, $2)`

// const INSERT = `
//   insert into facebook_creatives
//     (ad_id, post_id)
//   select $1, $2
//   where not exists (select 1 from facebook_creatives where ad_id = $1 and post_id = $2)`

const SELECT = `select * from facebook_creatives where ad_id = $1 and post_id = $2`

export interface Update {
  ({ ad_id, post_id }): Promise<Creative>
}

export const update = (values): Promise<Creative> => {
  const { ad_id, post_id } = values
  return query(INSERT, [ad_id, post_id]) as Promise<Creative>
}

export const select = (values): Promise<Creative> => {
  const { ad_id, post_id } = values
  return query(SELECT, [ad_id, post_id])
}
