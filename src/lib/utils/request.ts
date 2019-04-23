import crossFetch from 'cross-fetch'
import { ApiError, ApiErrorDetails } from '../../types/api'
import { ErrorResponse } from 'response';
import { INTERNAL_ERROR_CODE } from '../constants';

const parseResponse = async (response: Response): Promise<any> => {
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('json')) {
    return response.json()
  }
  return new Promise<any>((resolve) => (resolve(null)));
}

const parseError = async (response: Response): Promise<ApiErrorDetails[]> => {
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('json')) {
    const json = await response.json()
    const responseBody = (<ApiError>json)
    return responseBody.errors
  }
  if (contentType && contentType.includes('text')) {
    const text = await response.text()
    return [<ApiErrorDetails>({ message: text, code: INTERNAL_ERROR_CODE })]
  }
  return [<ApiErrorDetails>({ message: response.statusText, code: "SC-Unknown" })]
}

const checkStatus = async (response: Response): Promise<Response> => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const errors = await parseError(response)
  throw <ErrorResponse>{ errors: errors, code: response.status }
}

export default function request(url: string, options: object): Promise<any> {
  return crossFetch(url, options)
    .then(checkStatus)
    .then(parseResponse)
}
