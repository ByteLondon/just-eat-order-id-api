import { parse, stringify } from 'csv'
import { Transform, Writable } from 'stream'
import { createReadStream, appendFileSync } from 'fs'

const columns = [
  'campaign_id',
  'campaign_name',
  'campaign_status',
  'campaign_objective',
  'key_result',
  'buying_type',
  'campaign_spend_limit',
  'tags',
  'product_catalog_id',
  'ad_set_id',
  'ad_set_run_status',
  'ad_set_lifetime_impressions',
  'ad_set_name',
  'ad_set_time_start',
  'ad_set_time_stop',
  'ad_set_daily_budget',
  'destination_type',
  'ad_set_lifetime_budget',
  'rate_card',
  'ad_set_schedule',
  'use_accelerated_delivery',
  'link_object_id',
  'optimized_conversion_tracking_pixels',
  'optimized_event',
  'application_id',
  'product_set_id',
  'object_store_url',
  'offer_id',
  'countries',
  'regions',
  'location_types',
  'gender',
  'age_min',
  'age_max',
  'education_status',
  'relationship',
  'family_statuses',
  'connections',
  'excluded_connections',
  'friends_of_connections',
  'targeting_optimization',
  'publisher_platforms',
  'facebook_positions',
  'instagram_positions',
  'audience_network_positions',
  'messenger_positions',
  'device_platforms',
  'user_device',
  'user_operating_system',
  'user_os_version',
  'excluded_publisher_categories',
  'automatically_set_bid',
  'use_average_bid',
  'optimization_goal',
  'attribution_spec',
  'billing_event',
  'bid_amount',
  'story_id',
  'ad_id',
  'ad_status',
  'preview_link',
  'instagram_preview_link',
  'ad_name',
  'title',
  'body',
  'link_description',
  'display_link',
  'conversion_tracking_pixels',
  'image_hash',
  'image_crops',
  'instagram_platform_image_hash',
  'creative_type',
  'video_id',
  'instagram_account_id',
  'mobile_app_deep_link',
  'call_to_action',
  'call_to_action_link',
  'video_retargeting',
  'permalink',
  'force_single_link',
  'creative_optimization',
  'deep_link_for_android',
  'facebook_app_id',
  'add_end_card',
  'app_destination',
  'use_page_as_actor'
]

const toISOString = s => {
  const d = new Date(s)
  if (isNaN(d.getTime())) return null
  const iso = d.toISOString()
  return `${iso.substring(0, 10)} ${iso.substring(11, 19)}`
}

const unprefix = s => {
  if (typeof s !== 'string') return s
  const index = s.indexOf(':')
  return index === -1 ? s : s.substring(index + 1)
}

// todo: extract setup_products at the same time
const transform = () =>
  new Transform({
    objectMode: true,
    transform(chunk, enc, cb) {
      cb(null, {
        campaign_id: unprefix(chunk['Campaign ID']),
        campaign_name: chunk['Campaign Name'],
        campaign_status: chunk['Campaign Status'],
        campaign_objective: chunk['Campaign Objective'],
        key_result: chunk['Key Result'],
        buying_type: chunk['Buying Type'],
        campaign_spend_limit: +chunk['Campaign Spend Limit'],
        tags: chunk['Tags'],
        product_catalog_id: chunk['Product Catalog ID'],
        ad_set_id: unprefix(chunk['Ad Set ID']),
        ad_set_run_status: chunk['Ad Set Run Status'],
        ad_set_lifetime_impressions: +chunk['Ad Set Lifetime Impressions'],
        ad_set_name: chunk['Ad Set Name'],
        ad_set_time_start: toISOString(chunk['Ad Set Time Start']),
        ad_set_time_stop: toISOString(chunk['Ad Set Time Stop']),
        ad_set_daily_budget: +chunk['Ad Set Daily Budget'],
        destination_type: chunk['Destination Type'],
        ad_set_lifetime_budget: chunk['Ad Set Lifetime Budget'],
        rate_card: chunk['Rate Card'],
        ad_set_schedule: chunk['Ad Set Schedule'],
        use_accelerated_delivery: chunk['Use Accelerated Delivery'],
        link_object_id: chunk['Link Object ID'],
        optimized_conversion_tracking_pixels: chunk['Optimized Conversion Tracking Pixels'],
        optimized_event: chunk['Optimized Event'],
        application_id: chunk['Application ID'],
        product_set_id: chunk['Product Set ID'],
        object_store_url: chunk['Object Store URL'],
        offer_id: chunk['Offer ID'],
        countries: chunk['Countries'],
        regions: chunk['Regions'],
        location_types: chunk['Location Types'],
        gender: chunk['Gender'],
        age_min: +chunk['Age Min'],
        age_max: +chunk['Age Max'],
        education_status: chunk['Education Status'],
        relationship: chunk['Relationship'],
        family_statuses: chunk['Family Statuses'],
        connections: chunk['Connections'],
        excluded_connections: chunk['Excluded Connections'],
        friends_of_connections: chunk['Friends of Connections'],
        targeting_optimization: chunk['Targeting Optimization'],
        publisher_platforms: chunk['Publisher Platforms'],
        facebook_positions: chunk['Facebook Positions'],
        instagram_positions: chunk['Instagram Positions'],
        audience_network_positions: chunk['Audience Network Positions'],
        messenger_positions: chunk['Messenger Positions'],
        device_platforms: chunk['Device Platforms'],
        user_device: chunk['User Device'],
        user_operating_system: chunk['User Operating System'],
        user_os_version: chunk['User OS Version'],
        excluded_publisher_categories: chunk['Excluded Publisher Categories'],
        automatically_set_bid: chunk['Automatically Set Bid'],
        use_average_bid: chunk['Use Average Bid'],
        optimization_goal: chunk['Optimization Goal'],
        attribution_spec: chunk['Attribution Spec'],
        billing_event: chunk['Billing Event'],
        bid_amount: chunk['Bid Amount'],
        story_id: chunk['Story ID'],
        ad_id: unprefix(chunk['Ad ID']),
        ad_status: chunk['Ad Status'],
        preview_link: chunk['Preview Link'],
        instagram_preview_link: chunk['Instagram Preview Link'],
        ad_name: chunk['Ad Name'],
        title: chunk['Title'],
        body: chunk['Body'],
        link_description: chunk['Link Description'],
        display_link: chunk['Display Link'],
        conversion_tracking_pixels: chunk['Conversion Tracking Pixels'],
        image_hash: chunk['Image Hash'],
        image_crops: chunk['Image Crops'],
        instagram_platform_image_hash: chunk['Instagram Platform Image Hash'],
        creative_type: chunk['Creative Type'],
        video_id: chunk['Video ID'],
        instagram_account_id: chunk['Instagram Account ID'],
        mobile_app_deep_link: chunk['Mobile App Deep Link'],
        call_to_action: chunk['Call to Action'],
        call_to_action_link: chunk['Call to Action Link'],
        video_retargeting: chunk['Video Retargeting'],
        permalink: chunk['Permalink'],
        force_single_link: chunk['Force Single Link'],
        creative_optimization: chunk['Creative Optimization'],
        deep_link_for_android: chunk['Deep Link For Android'],
        facebook_app_id: chunk['Facebook App ID'],
        add_end_card: chunk['Add End Card'],
        app_destination: chunk['App Destination'],
        use_page_as_actor: chunk['Use Page as Actor']
      })
    }
  })

const append = resolve =>
  new Writable({
    write(chunk, encoding, cb) {
      appendFileSync(process.argv[2], chunk, { encoding })
      cb()
    },
    final() {
      resolve()
    }
  })

const main = async () => {
  // only add a header to the first file
  let header = true
  for (const arg of process.argv.slice(3)) {
    console.log(arg)
    await new Promise(resolve =>
      createReadStream(arg, { encoding: 'utf-8' })
        .pipe(parse({ columns: true, delimiter: '\t', relax_column_count: true }))
        .pipe(transform())
        .pipe(stringify({ columns, delimiter: '|', header }))
        .pipe(append(resolve))
    ).then(() => (header = false))
  }
}

main().catch(console.error)
