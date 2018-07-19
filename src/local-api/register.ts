import { Request, Response } from 'express'

import { login as loginUser } from '../backend-api'
import { registerRequest } from './models'
import { hashSha512 } from '../crypto'
import { jsonResponse, errorResponse } from './response'
import validate from './validate'
import { API_ERROR } from '../constants';

const clientApp = async (req: Request, res: Response) => {
  // TODO: validate request
  const validationErrors = validate(req.body, registerRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const { login, password } = req.body

  const backendResponse = await loginUser(login, hashSha512(password))

  // TODO: check if there was no errors during backend request
  const token = backendResponse.token

  // TODO: send missing data: userData, tokenExp, etc.
  jsonResponse(res, { token })
}

export default clientApp
