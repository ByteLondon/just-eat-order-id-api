const INSERT_ADS = `
  insert into table facebook_ads
  (ad_id,
  ad_name,
  adset_name,
  campaign_id,
  campaign_name,
  objective,
  date_start,
  date_stop,
  ad_account
  ) values
  ($1, $2, $3, $4, $5, $6, $7, $8, $9)`
