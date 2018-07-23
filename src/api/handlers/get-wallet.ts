import { Request, Response } from 'express'

import { jsonResponse, errorResponse } from '../response'
import { getWalletRequest } from '../models'
import { getWallet as getWalletBackend } from '../../common/backend-api'
import { API_ERROR } from '../../common/constants'
import validate from '../validate'

const getWallet = async (req: Request, res: Response) => {
  const validationErrors = validate(req, getWalletRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const backendResponse = await getWalletBackend(req.header('authorization'), req.params.id)

  // TODO: check if there was no errors during backend request
  jsonResponse(res, { ...backendResponse })
}

export default getWallet
