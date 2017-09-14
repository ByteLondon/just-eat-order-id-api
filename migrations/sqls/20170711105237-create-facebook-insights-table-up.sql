create table facebook_insights
(
  ad_id text primary key,
  ad_name text,
  adset_name text,
  adset_id text,
  campaign_id text,
  campaign_name text,
  objective text,
  date_start date,  --'2017-06-29'
  date_stop date,
  ad_account text
);