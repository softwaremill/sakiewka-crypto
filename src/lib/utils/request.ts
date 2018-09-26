import nodeFetch, { Response } from 'node-fetch'
import { ApiError } from '../../types/api'

const parseJSON = (response: Response): null | Promise<ApiError> => {
  if (response.status === 204 || response.status === 205) {
    return null
  }

  return response.json()
}

const checkStatus = async (response: Response): Promise<Response> => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const responseBody = await parseJSON(response)
  throw new Error(responseBody.error.message)
}

export default function request(url: string, options: object): Promise<any> {
  return nodeFetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
}
