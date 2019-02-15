import { Recipient, WalletParams } from '../types/domain'
import { ROOT_DERIVATION_PATH } from './constants'
import {
  createWallet as createWalletBackend,
  getWallet as getWalletBackend,
  getWalletBalance as getWalletBalanceBackend,
  listUnspents as listUnspentsBackend,
  listWallets as listWaletsBackend,
  maxTransferAmount as maxTransferAmountBackend
} from './backend-api'
import { deriveKeyPair, encryptKeyPair, generateNewKeyPair } from './key'
import { CreateWalletBackendParams, GetUtxosBackendParams, MaxTransferAmountParams, ReceipientsBackend } from 'response'
import { satoshiToBtc } from './utils/helpers'
import { generatePdf } from './keycard-pdf'

export const createWallet = async (userToken: string, params: WalletParams): Promise<any> => {
  const userKeyPair = params.userPubKey ?
    { pubKey: params.userPubKey } :
    deriveKeyPair(generateNewKeyPair(), ROOT_DERIVATION_PATH)

  const backupKeyPair = params.backupPubKey ?
    { pubKey: params.backupPubKey } :
    deriveKeyPair(generateNewKeyPair(), ROOT_DERIVATION_PATH)

  const encryptedUserKeyPair = encryptKeyPair(userKeyPair, params.passphrase)
  const encryptedBackupKeyPair = encryptKeyPair(backupKeyPair, params.passphrase)

  const backendRequestParams = {
    name: params.name,
    userPubKey: encryptedUserKeyPair.pubKey,
    userPrvKey: encryptedUserKeyPair.prvKey,
    backupPubKey: encryptedBackupKeyPair.pubKey,
    backupPrvKey: encryptedBackupKeyPair.prvKey
  }
  const response = await createWalletBackend(userToken, <CreateWalletBackendParams>backendRequestParams)
  const pdf = await generatePdf(
    params.name,
    backendRequestParams.userPrvKey || '',
    backendRequestParams.backupPrvKey || '',
    response.servicePubKey,
    '../../resources/sml-logo.png'
  )

  return { ...response, pdf }
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

export const listUnspents = (
  token: string, walletId: string, feeRate: string, recipients: Recipient[]
) => {
  const params = {
    feeRate,
    recipients: recipients.map((r: Recipient) => <ReceipientsBackend>({
      address: r.address,
      amount: satoshiToBtc(r.amount).toString()
    }))
  }
  return listUnspentsBackend(token, walletId, <GetUtxosBackendParams>params)
}

export const maxTransferAmount = (token: string, walletId: string, feeRate: string, recipient: string) => {
  const params: MaxTransferAmountParams = {
    recipient,
    feeRate
  }
  return maxTransferAmountBackend(token, walletId, params)
}
