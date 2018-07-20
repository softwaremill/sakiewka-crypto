import { Request, Response } from 'express'

import { info as infoUser } from '../common/backend-api'
import { hashSha512 } from '../common/crypto'
import { jsonResponse, errorResponse } from './response'
import { infoRequest } from './models'
import { API_ERROR } from '../common/constants';
import validate from './validate'

const info = async (req: Request, res: Response) => {
  const validationErrors = validate(req, infoRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const token = req.header('authorization')
  const backendResponse = await infoUser(token)

  // TODO: check if there was no errors during backend request
  jsonResponse(res, { ...backendResponse })
}

export default info
