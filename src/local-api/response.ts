import { Response } from 'express'

import { ApiError } from './models'

export const jsonResponse = (res: Response, data: object) => {
  const body = JSON.stringify({
    data,
    status: 'success'
  })

  res.json(body)
}

export const errorResponse = (res: Response, error: ApiError) => {
  const body = {
    status: 'error',
    ...error
  }

  res.status(error.code)
  res.json(body)
}
