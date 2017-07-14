import { query } from './core'
export const JOIN_ALL = `select
  insights.ad_id, insights.ad_name, insights.adset_id, insights.adset_name, insights.campaign_id, insights.campaign_name, insights.objective, insights.ad_account,
  posts.post_id, posts.message, posts.permalink_url, posts.link, posts.type
  from facebook_insights insights full outer join facebook_creatives creatives on insights.ad_id = creatives.ad_id
  full outer join facebook_posts posts on creatives.post_id = posts.post_id`

// Selects FB objectives
export const SELECT_OBJECTIVES = `
select insights.ad_id, insights.objective, posts.link
from facebook_insights insights
  left join facebook_creatives creatives using (ad_id)
  left join facebook_posts posts using (post_id)`

// Adds Marketing objectives
export const UPDATE_MARKETING_OBJECTIVES = `update facebook_insights set marketing_objective = $2 where ad_id = $1`

export const selectObjectives = () => query(SELECT_OBJECTIVES, [])

export const updateMarketingObjective = (args: string[]) =>
  query(UPDATE_MARKETING_OBJECTIVES, args)
