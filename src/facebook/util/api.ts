import axios, { AxiosResponse } from 'axios'

export const checkStatusCode = <T>(response: AxiosResponse): Promise<T> => {
  if (Math.floor(response.status / 100) !== 2) {
    throw new Error(response.statusText)
  }
  return response.data
}

export default axios.create({
  baseURL: 'https://graph.facebook.com/v2.9',
  timeout: 60000
})
