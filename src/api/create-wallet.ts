import { Request, Response } from 'express'

import { createWallet as createWalletBackend } from '../common/backend-api'
import { jsonResponse, errorResponse } from './response'
import { createWalletRequest } from './models'
import { API_ERROR } from '../common/constants'
import validate from './validate'
import { prepareKeypairs } from '../common/wallet'
import { filterObject } from '../common/utils/helpers'

const crateWallet = async (req: Request, res: Response) => {
  const validationErrors = validate(req, createWalletRequest)

  if (validationErrors.length > 0) {
    return errorResponse(res, API_ERROR.BAD_REQUEST, validationErrors[0])
  }

  const { passphrase, userPubKey, backupPubKey, label } = req.body
  const keypairs = prepareKeypairs({ passphrase, userPubKey, backupPubKey })

  const token = req.header('authorization')

  const backendRequestParams = filterObject(
    {
      label,
      userPubKey: keypairs.user.pubKey,
      userPrivKey: keypairs.user.privKey,
      backupPubKey: keypairs.backup.pubKey,
      backupPrivKey: keypairs.backup.privKey
    },
    (value: any) => value
  )

  const backendResponse = await createWalletBackend(token, backendRequestParams)

  // TODO: check if there was no errors during backend request
  jsonResponse(res, { ...backendResponse })
}

export default crateWallet
