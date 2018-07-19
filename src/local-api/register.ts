import { Request, Response } from 'express'

import { register } from '../backend-api'
import { registerRequest } from './models'
import { hashSha512 } from '../crypto'
import { jsonResponse, errorResponse } from './response'
import validate from './validate'
import { API_ERROR } from '../constants';

const clientApp = async (req: Request, res: Response) => {
  const validationErrors = validate(req.body, registerRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const { login, password } = req.body

  const backendResponse = await register(login, hashSha512(password))

  // TODO: check if there was no errors during backend request
  jsonResponse(res, {})
}

export default clientApp
