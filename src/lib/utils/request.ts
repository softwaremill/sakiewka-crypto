import nodeFetch, { Response } from 'node-fetch'

const parseJSON = (response: Response): null | object => {
  if (response.status === 204 || response.status === 205) {
    return null
  }

  return response.json()
}

const checkStatus = (response: Response): void | Response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new Error(response.statusText)
  throw error
}

export default function request(url: string, options: object): Promise<object> {
  return nodeFetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
}
