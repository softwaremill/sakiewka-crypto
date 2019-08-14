import { CreateWalletParams } from '../../types/domain/wallet'
import {
  ListWalletsResponse,
  GetWalletResponse,
  MaxTransferAmountResponse,
  EditWalletResponse,
} from '../../types/response/wallet'
import {
  CreateWalletBackendParams,
  MaxTransferAmountEosBackendParams,
} from '../../types/api/wallet'
import { ListPoliciesForWalletResponse } from '../../types/response/policy'
import { EosKeyModule } from './eos-key'
import { EosBackendApi } from './eos-backend-api'

export interface EosWalletApi {
  createWallet(userToken: string, params: CreateWalletParams): Promise<any>

  getWallet(userToken: string, walletId: string): Promise<GetWalletResponse>

  listWallets(
    userToken: string,
    limit: number,
    searchPhrase?: string,
    nextPageToken?: string,
  ): Promise<ListWalletsResponse>

  maxTransferAmount(
    token: string,
    walletId: string,
    feeRate: number,
    recipient: string,
  ): Promise<MaxTransferAmountResponse>

  listPoliciesForWallet(
    token: string,
    walletId: string,
  ): Promise<ListPoliciesForWalletResponse>

  editWallet(
    userToken: string,
    walletId: string,
    newName: string,
  ): Promise<EditWalletResponse>
}

export const walletApiFactory = (
  backendApi: EosBackendApi,
  keyModule: EosKeyModule,
): EosWalletApi => {
  const createWallet = async (
    userToken: string,
    params: CreateWalletParams,
  ): Promise<any> => {
    const generateKeyPair = async (): Promise<{
      pubKey: string;
      prvKey: string;
    }> => {
      const key = await keyModule.generateNewKey()
      const encryptedPrivateKey = keyModule.encryptKey(
        key.toString(),
        params.passphrase,
      )
      const publicKey = key.toPublic().toString()
      return { pubKey: publicKey, prvKey: encryptedPrivateKey }
    }

    const userKey = await (params.userPubKey
      ? { pubKey: params.userPubKey, prvKey: undefined }
      : generateKeyPair())
    const backupKey = await (params.backupPubKey
      ? {
        pubKey: params.backupPubKey,
        prvKey: undefined,
      }
      : generateKeyPair())

    const backendRequestParams: CreateWalletBackendParams = {
      name: params.name,
      userPubKey: userKey.pubKey,
      userPrvKey: userKey.prvKey,
      backupPubKey: backupKey.pubKey,
      backupPrvKey: backupKey.prvKey,
    }
    const response = await backendApi.createWallet(
      userToken,
      backendRequestParams,
    )
    return { ...response }
  }

  const editWallet = (
    userToken: string,
    walletId: string,
    newName: string,
  ): Promise<EditWalletResponse> =>
    backendApi.editWallet(userToken, walletId, newName)

  const getWallet = (
    userToken: string,
    walletId: string,
  ): Promise<GetWalletResponse> => backendApi.getWallet(userToken, walletId)

  const listWallets = (
    userToken: string,
    limit: number,
    searchPhrase?: string,
    nextPageToken?: string,
  ): Promise<ListWalletsResponse> =>
    backendApi.listWallets(userToken, limit, searchPhrase, nextPageToken)

  const maxTransferAmount = (
    token: string,
    walletId: string,
    feeRate: number,
    recipient: string,
  ): Promise<MaxTransferAmountResponse> => {
    const params: MaxTransferAmountEosBackendParams = {
      recipient,
    }
    return backendApi.maxTransferAmount(token, walletId, params)
  }

  const listPoliciesForWallet = (
    token: string,
    walletId: string,
  ): Promise<ListPoliciesForWalletResponse> => {
    return backendApi.listPoliciesForWallet(token, walletId)
  }

  return {
    createWallet,
    editWallet,
    getWallet,
    listWallets,
    maxTransferAmount,
    listPoliciesForWallet,
  }
}
