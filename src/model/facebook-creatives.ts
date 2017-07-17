import { query, unpackFirstRow } from './core'
import { pickBy, isBoolean } from 'lodash'
import { Creative } from '../facebook/creatives'

const INSERT = `
  insert into facebook_creatives
  (ad_id, post_id) values ($1, $2)`

export const insert = (values): Promise<Creative> => {
  const { ad_id, post_id } = values
  return query(INSERT, [ad_id, post_id]).then(unpackFirstRow) as Promise<
    Creative
  >
}
