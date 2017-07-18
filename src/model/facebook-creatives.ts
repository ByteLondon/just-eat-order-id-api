import { query, unpackFirstRow } from './core'
import { pickBy, isBoolean } from 'lodash'
import { Creative } from '../facebook/creatives'

const DELETE_BEFORE_UPDATE = `delete from facebook_creatives where ad_id = $1`

const INSERT = `
  insert into facebook_creatives
  (ad_id, post_id) values ($1, $2)`

export const update = (values): Promise<Creative> => {
  const { ad_id, post_id } = values
  query(DELETE_BEFORE_UPDATE, [ad_id])
  return query(INSERT, [ad_id, post_id]).then(unpackFirstRow) as Promise<
    Creative
  >
}
