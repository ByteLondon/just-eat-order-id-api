interface OrderId {
  order_id: string
  pixel_id: string
  app_id: string
  conversion_device:
    | 'Android Web'
    | 'Android Native'
    | 'Desktop Web'
    | 'iOS Web'
    | 'iOS Native'
    | 'Other'
  order_timestamp: number //UTC timestamp
  attributions: Attributions[]
  attribution_type: 'link_click' | 'view'
}

interface Attributions {
  ad_id: string
  adset_id: string
  campaign_id: string
  account_id: string
  action_type:
    | 'Link Click'
    | 'Social Click'
    | 'Video Play'
    | 'Other Click'
    | 'Impression'
  impression_cost: number //US Dollars
  click_cost: number //US Dollars
  impression_timestamp: number //UTC timestamp
  click_timestamp: number //UTC timestamp
  placement: 'WebFeed' | 'MobileFeed' | 'RHC' | 'Instagram' | 'Others'
  device: 'Desktop' | 'Android' | 'iOS' | 'Others'
}
