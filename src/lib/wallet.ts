import { Currency, Recipient, WalletParams } from '../types/domain'
import { ROOT_DERIVATION_PATH } from './constants'
import { CreateWalletBackendParams, GetUtxosBackendParams, MaxTransferAmountParams, ReceipientsBackend } from 'response'
import { generatePdf } from './keycard-pdf'
import keyFactory from './key'
import * as backendApiFactory from './backend-api'

export default (backendApiUrl: string, currency: Currency, btcNetwork: string) => {
  const keyModule = keyFactory(backendApiUrl, currency, btcNetwork)
  const backendApi = backendApiFactory.withCurrency(backendApiUrl, currency)

  const createWallet = async (userToken: string, params: WalletParams): Promise<any> => {
    const userKeyPair = params.userPubKey ?
      { pubKey: params.userPubKey } :
      keyModule.deriveKeyPair(keyModule.generateNewKeyPair(), ROOT_DERIVATION_PATH)

    const backupKeyPair = params.backupPubKey ?
      { pubKey: params.backupPubKey } :
      keyModule.deriveKeyPair(keyModule.generateNewKeyPair(), ROOT_DERIVATION_PATH)

    const encryptedUserKeyPair = keyModule.encryptKeyPair(userKeyPair, params.passphrase)
    const encryptedBackupKeyPair = keyModule.encryptKeyPair(backupKeyPair, params.passphrase)

    const backendRequestParams = {
      name: params.name,
      userPubKey: encryptedUserKeyPair.pubKey,
      userPrvKey: encryptedUserKeyPair.prvKey,
      backupPubKey: encryptedBackupKeyPair.pubKey,
      backupPrvKey: encryptedBackupKeyPair.prvKey
    }
    const response = await backendApi.createWallet(userToken, <CreateWalletBackendParams>backendRequestParams)
    const pdf = await generatePdf(
      params.name,
      response.servicePubKey,
      backendRequestParams.userPrvKey,
      backendRequestParams.backupPrvKey,
      '../../resources/sml-logo.png'
    )

    return { ...response, pdf }
  }

  const getWallet = (userToken: string, walletId: string) => backendApi.getWallet(userToken, walletId)

  const listWallets = (userToken: string, limit: number, nextPageToken?: string) => backendApi.listWallets(userToken, limit, nextPageToken)

  const getWalletBalance = (userToken: string, walletId: string) => backendApi.getWalletBalance(userToken, walletId)

  const listUnspents = (
    token: string, walletId: string, feeRate: string, recipients: Recipient[]
  ) => {
    const params = {
      feeRate,
      recipients: recipients.map((r: Recipient) => <ReceipientsBackend>({
        address: r.address,
        amount: r.amount.toString()
      }))
    }
    return backendApi.listUnspents(token, walletId, <GetUtxosBackendParams>params)
  }

  const maxTransferAmount = (token: string, walletId: string, feeRate: string, recipient: string) => {
    const params: MaxTransferAmountParams = {
      recipient,
      feeRate
    }
    return backendApi.maxTransferAmount(token, walletId, params)
  }

  return {
    createWallet,
    getWallet,
    getWalletBalance,
    listUnspents,
    listWallets,
    maxTransferAmount
  }
}