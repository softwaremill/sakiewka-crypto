import nodeFetch, { Response } from 'node-fetch'
import { ApiError } from '../../types/api'

const parseJSON = async (response: Response): null | Promise<ApiError> => {
  const contentType = response.headers.get('content-type')

  if (!contentType.includes('json')) {
    throw new Error(`Response from ${response.url} was not a JSON. Resonse text: "${await response.text()}"`)
  }

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
  const message = responseBody.error ? responseBody.error.message : responseBody
  throw new Error(String(message))
}

export default function request(url: string, options: object): Promise<any> {
  return nodeFetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
}
