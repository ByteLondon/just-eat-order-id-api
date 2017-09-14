create table facebook_posts
(
  post_id text primary key,
  message text,
  permalink_url text,
  type text,
  created_time timestamptz,
  link text,
  page_id text
);