import { WalletParams } from '../types/domain'
import { ROOT_DERIVATION_PATH } from './constants'
import { removeUndefinedFromObject } from './utils/helpers'
import {
  createWallet as createWalletBackend,
  getWallet as getWalletBackend,
  listWallets as listWaletsBackend,
  getWalletBalance as getWalletBalanceBackend,
  getUnspents as getUnspentsBackend
} from './backend-api'
import { deriveKeyPair, generateNewKeyPair, encryptKeyPair } from './key'
import { CreateWalletBackendParams } from '../types/backend-api'

export const createWallet = async (userToken: string, params: WalletParams): Promise<any> => {
  const userKeyPair = params.userPubKey ?
    { pubKey: params.userPubKey } :
    deriveKeyPair(generateNewKeyPair(), ROOT_DERIVATION_PATH)

  const backupKeyPair = params.backupPubKey ?
    { pubKey: params.backupPubKey } :
    deriveKeyPair(generateNewKeyPair(), ROOT_DERIVATION_PATH)

  const encryptedUserKeyPair = encryptKeyPair(userKeyPair, params.passphrase)
  const encryptedBackupKeyPair = encryptKeyPair(backupKeyPair, params.passphrase)

  const backendRequestParams = removeUndefinedFromObject({
    name: params.name,
    userPubKey: encryptedUserKeyPair.pubKey,
    userPrvKey: encryptedUserKeyPair.prvKey,
    backupPubKey: encryptedBackupKeyPair.pubKey,
    backupPrvKey: encryptedBackupKeyPair.prvKey
  })

  return createWalletBackend(
    userToken,
    <CreateWalletBackendParams> backendRequestParams
  )
}

export const getWallet = (
  userToken: string, walletId: string
) => getWalletBackend(userToken, walletId)

export const listWallets = (
  userToken: string, limit: number, nextPageToken?: string
) => listWaletsBackend(userToken, limit, nextPageToken)

export const getWalletBalance = (
  userToken: string, walletId: string
) => getWalletBalanceBackend(userToken, walletId)

export const getUnspents = (
  token: string, walletId: string, amount: number, feeRate?: number
) => getUnspentsBackend(token, walletId, amount, feeRate)
