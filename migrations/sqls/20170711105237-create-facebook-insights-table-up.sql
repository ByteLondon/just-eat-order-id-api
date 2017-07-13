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
  ad_account text,
  entry_date timestamp default now() not null,
  entry_update_date timestamp default now() not null
);


create or replace function entry_update_date() returns trigger as $$
begin new.entry_update_date := current_timestamp;
  return new;
end
$$ language plpgsql;


create trigger facebook_insights_entry_update_date
before update on facebook_insights 
for each row execute procedure entry_update_date();
