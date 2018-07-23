import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../response'
import { listWalletsRequest } from '../models'
import { listWallets as listWalletsBackend } from '../../common/backend-api'
import { API_ERROR } from '../../common/constants'
import validate from '../validate'

const listWallets = async (req: Request, res: Response) => {
  const validationErrors = validate(req, listWalletsRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const backendResponse = await listWalletsBackend(req.header('authorization'))

  // TODO: check if there was no errors during backend request
  jsonResponse(res, { ...backendResponse })
}

export default listWallets
