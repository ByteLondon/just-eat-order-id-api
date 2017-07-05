export interface Post {
  id: string
  name: string
  message: string
  permalink_url: string
  type: string // enum{link, status, photo, video, offer}
  created_time: string // datetime
  updated_time: string // datetime
}
