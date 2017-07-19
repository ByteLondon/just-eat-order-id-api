import { query } from './core'

// Selects FB objectives
const SELECT_OBJECTIVES = `
select insights.ad_id, insights.objective, posts.link
from facebook_insights insights
  left join facebook_creatives creatives using (ad_id)
  left join facebook_posts posts using (post_id)`

const SELECT_TYPES = `select post_id, type, link from facebook_posts`

// Adds Marketing objectives
const UPDATE_MARKETING_OBJECTIVES = `update facebook_insights set marketing_objective = $2 where ad_id = $1`

const UPDATE_POST_FORMAT = `update facebook_posts set post_format = $2 where post_id = $1`

export const selectObjectives = () => query(SELECT_OBJECTIVES, [])

export const selectTypes = () => query(SELECT_TYPES, [])

export const updateMarketingObjective = (args: string[]) =>
  query(UPDATE_MARKETING_OBJECTIVES, args)

export const updatePostFormat = (args: string[]) =>
  query(UPDATE_POST_FORMAT, args)

export const JOIN_ALL = `
select orders.order_id, orders.customer_id, orders.joined_at, orders.ordered_at, orders.platform, orders.postcode, orders.restaurant_id, orders.cuisine, orders.amount, orders.num_items,
attributions.conversion_device, attributions.raising_component, attributions.order_id, attributions.app_id, attributions.order_timestamp, attributions.pixel_id, attributions.attribution_type, attributions.attributions_impression_timestamp, attributions.attributions_ad_id,
attributions.attributions_account_id, attributions.attributions_impression_cost, attributions.attributions_adset_id, attributions.attributions_campaign_id, attributions.attributions_click_cost, attributions.attributions_action_type, attributions.attributions_device, attributions.attributions_placement, attributions.id, attributions.tenant,
insights.ad_id, insights.ad_name, insights.adset_id, insights.adset_name, insights.campaign_id, insights.campaign_name, insights.objective, insights.ad_account,
posts.post_id, posts.message, posts.permalink_url, posts.link, posts.type
from facebook_orders orders 
  left join order_attributions attributions using (order_id)
  left join facebook_insights insights on attributions.attributions_ad_id = insights.ad_id
  left join facebook_creatives creatives using (ad_id)
  left join facebook_posts posts using (post_id) where orders.ordered_at > '2016-10-01 00:00:00' and attributions.attributions_ad_id is not null;`
