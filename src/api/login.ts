import { Request, Response } from 'express'

import { login as loginUser } from '../common/backend-api'
import { hashSha512 } from '../common/crypto'
import { jsonResponse } from './response'

const clientApp = async (req: Request, res: Response) => {
  // TODO: validate request

  const { login, password } = req.body

  const backendResponse = await loginUser(login, hashSha512(password))

  // TODO: check if there was no errors during backend request
  const token = backendResponse.token

  // TODO: send missing data: userData, tokenExp, etc.
  jsonResponse(res, { token })
}

export default clientApp
