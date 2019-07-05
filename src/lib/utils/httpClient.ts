import crossFetch from 'cross-fetch'
import { ApiError, ApiErrorDetails } from '../../types/api'
import { ErrorResponse } from 'response';
import { INTERNAL_ERROR_CODE } from '../constants';
import { CorrelationIdGetter } from '../backend-api';

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
  return [<ApiErrorDetails>({ message: response.statusText, code: 'SC-Unknown' })]
}

const checkStatus = async (response: Response): Promise<Response> => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const errors = await parseError(response)
  throw <ErrorResponse>{ errors: errors, code: response.status }
}

export interface OptionalQueryParam {
  key: string,
  value?: string | number | boolean
}

export const buildQueryParamString = (params: OptionalQueryParam[]) => {
  return params
    .filter(param => param.value)
    .map((param, index) => (index == 0 ? '?' : '&') + `${param.key}=${param.value}`)
    .join('')
}

export interface HttpClient {
  request(url: string, options: any): Promise<any>
}

export const createHttpClient = (getCorrelationId: CorrelationIdGetter): HttpClient => {
  const request = async (url: string, options: any): Promise<any> => {
    const richOptions = {
      ...options,
      headers: {
        ...options.headers,
        'X-Correlation-Id': getCorrelationId()
      }
    }
    return crossFetch(url, richOptions)
      .then(checkStatus)
      .then(parseResponse)
  }

  return {
    request
  }
}
