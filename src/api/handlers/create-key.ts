import { Request, Response } from 'express'

import { createWallet as createWalletBackend } from '../../common/backend-api'
import { jsonResponse, errorResponse } from '../response'
import { createKeyRequest } from '../models'
import { API_ERROR } from '../../common/constants'
import validate from '../validate'
import { generateNewKeypair, encryptKeyPair } from '../../common/wallet'
import { filterObject } from '../../common/utils/helpers'

const createKey = async (req: Request, res: Response) => {
  const validationErrors = validate(req, createKeyRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const newKeypair = generateNewKeypair()

  if (req.body.passphrase) {
    const encryptedKeypair = encryptKeyPair(newKeypair, req.body.passphrase)
    return jsonResponse(res, { keypair: encryptedKeypair })
  }

  jsonResponse(res, { keypair: newKeypair })
}

export default createKey
