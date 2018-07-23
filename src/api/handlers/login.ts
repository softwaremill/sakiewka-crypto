import { Request, Response } from 'express'

import { login as loginUser } from '../../common/backend-api'
import { hashSha512 } from '../../common/crypto'
import { jsonResponse, errorResponse } from '../response'
import { loginRequest } from '../models'
import { API_ERROR } from '../../common/constants';
import validate from '../validate'

const login = async (req: Request, res: Response) => {
  const validationErrors = validate(req, loginRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const { login, password } = req.body

  const backendResponse = await loginUser(login, hashSha512(password))

  // TODO: check if there was no errors during backend request
  const token = backendResponse.token

  jsonResponse(res, { token })
}

export default login
