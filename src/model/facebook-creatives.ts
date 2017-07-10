const INSERT_CREATIVES = `
  insert into table facebook_creatives
  (ad_id, post_id) values ($1, $2)`

interface FacebookCreatives {
  adId: string
  postId?: string
}

export const insertCreatives = (values): Promise<FacebookCreatives> => {
  const { adId, postId } = values
  return query(UPSERT_POSTS, [adId, postId]).then(unpackFirstRow) as Promise<
    FacebookCreatives
  >
}
