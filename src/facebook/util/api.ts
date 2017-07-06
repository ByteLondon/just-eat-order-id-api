import axios, { AxiosResponse } from 'axios'

export const checkStatusCode = <T>(response: AxiosResponse): Promise<T> => {
  if (Math.floor(response.status / 100) !== 2) {
    throw new Error(response.statusText)
  }
  return response.data[0].body
}

export default axios.create({
  baseURL: 'https://graph.facebook.com/',
  timeout: 60000
})

//TODO: push data to db at each page

export const fetchPagedData = () => {}
