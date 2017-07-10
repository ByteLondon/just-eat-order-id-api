create table facebook_posts
(
  post_id text primary key,
  message text,
  permalink_url text,
  type text,
  created_time text,
  link text,
  entry_date timestamp default now() not null,
  entry_update_date timestamp default now() not null
);