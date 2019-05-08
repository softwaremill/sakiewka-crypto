import { Recipient, WalletParams } from '../types/domain'
import { ROOT_DERIVATION_PATH } from './constants'
import {
  CreateWalletBackendParams,
  GetUtxosBackendParams,
  MaxTransferAmountParams,
  ReceipientsBackend,
  MaxTransferAmountResponse,
  ListUnspentsBackendResponse,
  ListWalletsBackendResponse,
  GetWalletBackendResponse,
  ListPoliciesForWalletResponse,
} from 'response'
import { generatePdf } from './keycard-pdf'
import { KeyModule } from './key'
import { CurrencyBackendApi } from './backend-api'

export interface WalletApi {
  createWallet(userToken: string, params: WalletParams): Promise<any>
  getWallet(userToken: string, walletId: string): Promise<GetWalletBackendResponse>
  listWallets(userToken: string, limit: number, nextPageToken?: string): Promise<ListWalletsBackendResponse>
  listUnspents(token: string, walletId: string, feeRate: number, recipients: Recipient[]): Promise<ListUnspentsBackendResponse>
  maxTransferAmount(token: string, walletId: string, feeRate: string, recipient: string): Promise<MaxTransferAmountResponse>
  listPoliciesForWallet(token: string, walletId: string): Promise<ListPoliciesForWalletResponse>
}

export const walletApiFactory = (backendApi: CurrencyBackendApi, keyModule: KeyModule): WalletApi => {

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
      backendRequestParams.backupPrvKey
    )

    return { ...response, pdf }
  }

  const getWallet = (userToken: string, walletId: string): Promise<GetWalletBackendResponse> => backendApi.getWallet(userToken, walletId)

  const listWallets = (userToken: string, limit: number, nextPageToken?: string): Promise<ListWalletsBackendResponse> => backendApi.listWallets(userToken, limit, nextPageToken)

  const listUnspents = (
    token: string, walletId: string, feeRate: number, recipients: Recipient[]
  ): Promise<ListUnspentsBackendResponse> => {
    const params = {
      feeRate,
      recipients: recipients.map((r: Recipient) => <ReceipientsBackend>({
        address: r.address,
        amount: r.amount.toString()
      }))
    }
    return backendApi.listUnspents(token, walletId, <GetUtxosBackendParams>params)
  }

  const maxTransferAmount = (token: string, walletId: string, feeRate: string, recipient: string): Promise<MaxTransferAmountResponse> => {
    const params: MaxTransferAmountParams = {
      recipient,
      feeRate
    }
    return backendApi.maxTransferAmount(token, walletId, params)
  }

  const listPoliciesForWallet = (token: string, walletId: string): Promise<ListPoliciesForWalletResponse> =>
    backendApi.listPoliciesForWallet(token, walletId)

  return {
    createWallet,
    getWallet,
    listUnspents,
    listWallets,
    maxTransferAmount,
    listPoliciesForWallet,
  }
}
