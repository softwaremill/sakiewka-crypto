import { WalletParams } from '../../types/domain'
import {
  CreateWalletBackendParams,
  GetWalletBackendResponse,
  ListPoliciesForWalletResponse,
  ListWalletsBackendResponse,
  MaxTransferAmountEosParams,
  MaxTransferAmountResponse
} from 'response'
import { KeyModule } from './eos-key'
import { EosBackendApi } from "./eos-backend-api";

export interface WalletApi {
  createWallet(userToken: string, params: WalletParams): Promise<any>

  getWallet(userToken: string, walletId: string): Promise<GetWalletBackendResponse>

  listWallets(userToken: string, limit: number, searchPhrase?:string, nextPageToken?: string): Promise<ListWalletsBackendResponse>

  maxTransferAmount(token: string, walletId: string, feeRate: number, recipient: string): Promise<MaxTransferAmountResponse>

  listPoliciesForWallet(token: string, walletId: string): Promise<ListPoliciesForWalletResponse>
}

export const walletApiFactory = (backendApi: EosBackendApi, keyModule: KeyModule): WalletApi => {
  const createWallet = async (userToken: string, params: WalletParams): Promise<any> => {
    const generateKeyPair = async (): Promise<{ pubKey: string, prvKey: string }> => {
      const key = await keyModule.generateNewKey()
      const encryptedPrivateKey = keyModule.encryptKey(key.toString(), params.passphrase)
      const publicKey = key.toPublic().toString()
      return { pubKey: publicKey, prvKey: encryptedPrivateKey }
    }

    const userKey = await (params.userPubKey ? { pubKey: params.userPubKey, prvKey: undefined } : generateKeyPair())
    const backupKey = await (params.backupPubKey ? {
      pubKey: params.backupPubKey,
      prvKey: undefined
    } : generateKeyPair())

    const backendRequestParams = {
      name: params.name,
      userPubKey: userKey.pubKey,
      userPrvKey: userKey.prvKey,
      backupPubKey: backupKey.pubKey,
      backupPrvKey: backupKey.prvKey
    }
    const response = await backendApi.createWallet(userToken, <CreateWalletBackendParams>backendRequestParams)
    return { ...response }
  }

  const getWallet = (userToken: string, walletId: string): Promise<GetWalletBackendResponse> => backendApi.getWallet(userToken, walletId)

  const listWallets = (userToken: string, limit: number, searchPhrase?:string, nextPageToken?: string): Promise<ListWalletsBackendResponse> => backendApi.listWallets(userToken, limit, searchPhrase, nextPageToken)

  const maxTransferAmount = (token: string, walletId: string, feeRate: number, recipient: string): Promise<MaxTransferAmountResponse> => {
    const params: MaxTransferAmountEosParams = {
      recipient
    }
    return backendApi.maxTransferAmount(token, walletId, params)
  }

  const listPoliciesForWallet = (token: string, walletId: string): Promise<ListPoliciesForWalletResponse> => {
    return backendApi.listPoliciesForWallet(token, walletId)
  }

  return {
    createWallet,
    getWallet,
    listWallets,
    maxTransferAmount,
    listPoliciesForWallet,
  }
}
