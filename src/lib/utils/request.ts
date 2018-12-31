import nodeFetch, { Response } from 'node-fetch'
import { ApiError } from '../../types/api'

const parseResponse = async (response: Response): Promise<any> => {
  console.log("kasper")
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('json')) {
    return response.json()
  }
  return new Promise<any>((resolve)=>(resolve(null)));
}

const parseError = async (response: Response): Promise<any> => {
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('json')) {
    return response.json().then(res => {
      const responseBody = (<ApiError>res)
      return responseBody.error ? responseBody.error.message : responseBody
    })
  }
  if(contentType && contentType.includes('text')){
    return response.text()
  }
  return response.statusText
}

const checkStatus = async (response: Response): Promise<Response> => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const message = await parseError(response)
  throw new Error(JSON.stringify(message))
}

export default function request(url: string, options: object): Promise<any> {
  return nodeFetch(url, options)
    .then(checkStatus)
    .then(parseResponse)
}
