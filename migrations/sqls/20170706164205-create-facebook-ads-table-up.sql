create table facebook_ads
(
  ad_id text primary key,
  ad_name text,
  adset_name text,
  campaign_id text,
  campaign_name text,
  objective text,
  --'2017-06-29'
  date_start text,
  date_stop text,
  ad_account text,
  entry_date timestamp default now() not null,
  entry_update_date timestamp default now() not null
);