export const JOIN = `select insights.*, posts.*
from facebook_insights insights inner join facebook_creatives creatives on insights.ad_id = creatives.ad_id
inner join facebook_posts posts on creatives.post_id = posts.post_id;`
