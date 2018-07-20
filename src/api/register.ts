import { Request, Response } from 'express'

import { register } from '../common/backend-api'
import { registerRequest } from './models'
import { hashSha512 } from '../common/crypto'
import { jsonResponse, errorResponse } from './response'
import validate from './validate'
import { API_ERROR } from '../common/constants';

const clientApp = async (req: Request, res: Response) => {
  const validationErrors = validate(req, registerRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const { login, password } = req.body

  const backendResponse = await register(login, hashSha512(password))

  // TODO: check if there was no errors during backend request
  jsonResponse(res, backendResponse)
}

export default clientApp
