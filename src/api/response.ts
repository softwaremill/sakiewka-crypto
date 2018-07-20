import { Response } from 'express'

import { ApiError } from '../types/api'

export const jsonResponse = (res: Response, data: object) => {
  const body = JSON.stringify({
    data,
    status: 'success'
  })

  res.json(body)
}

export const errorResponse = (res: Response, error: ApiError, customMessage?: string) => {
  if (customMessage) error.message = customMessage

  const body = {
    status: 'error',
    ...error
  }

  res.status(error.code)
  res.json(body)
}
