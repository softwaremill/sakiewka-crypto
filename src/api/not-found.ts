import { Request, Response } from 'express'

import { API_ERROR } from '../common/constants'
import { errorResponse } from './response'

const notFound = (req: Request, res: Response) => {
  errorResponse(res, API_ERROR.NOT_FOUND)
}

export default notFound
