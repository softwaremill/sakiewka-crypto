import { Recipient } from '../../types/domain'
import { CreateWalletParams } from '../../types/domain-types/wallet'
import {
  CreateWalletResponse,
  GetWalletResponse,
  ListWalletsResponse,
  ListUnspentsResponse,
  MaxTransferAmountResponse,
  ListPoliciesForWalletResponse,
} from '../../types/response-types/wallet'
import { ROOT_DERIVATION_PATH } from '../constants'
import {
  GetUtxosBackendParams,
  ReceipientsBackend,
  ListUtxosByAddressBackendResponse,
} from '../../types/response'
import {
  CreateWalletBackendParams,
  MaxTransferAmountBitcoinBackendParams,
} from '../../types/api-types/wallet'
import { generatePdf } from './bitcoin-keycard-pdf'
import { KeyModule } from './bitcoin-key'
import { BitcoinBackendApi } from './bitcoin-backend-api'

export interface WalletApi {
  createWallet(
    userToken: string,
    params: CreateWalletParams,
  ): Promise<CreateWalletResponse>
  editWallet(userToken: string, walletId: string, newName: string): Promise<{}>
  getWallet(userToken: string, walletId: string): Promise<GetWalletResponse>
  listWallets(
    userToken: string,
    limit: number,
    searchPhrase?: string,
    nextPageToken?: string,
  ): Promise<ListWalletsResponse>
  listUnspents(
    token: string,
    walletId: string,
    recipients: Recipient[],
    feeRate?: number,
  ): Promise<ListUnspentsResponse>
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
  listUtxosByAddress(
    token: string,
    walletId: string,
    address: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListUtxosByAddressBackendResponse>
}

export const walletApiFactory = (
  backendApi: BitcoinBackendApi,
  keyModule: KeyModule,
): WalletApi => {
  const createWallet = async (
    userToken: string,
    params: CreateWalletParams,
  ): Promise<CreateWalletResponse> => {
    const userKeyPair = params.userPubKey
      ? { pubKey: params.userPubKey }
      : keyModule.deriveKeyPair(
          keyModule.generateNewKeyPair(),
          ROOT_DERIVATION_PATH,
        )

    const backupKeyPair = params.backupPubKey
      ? { pubKey: params.backupPubKey }
      : keyModule.deriveKeyPair(
          keyModule.generateNewKeyPair(),
          ROOT_DERIVATION_PATH,
        )

    const encryptedUserKeyPair = keyModule.encryptKeyPair(
      userKeyPair,
      params.passphrase,
    )
    const encryptedBackupKeyPair = keyModule.encryptKeyPair(
      backupKeyPair,
      params.passphrase,
    )

    const backendRequestParams: CreateWalletBackendParams = {
      name: params.name,
      userPubKey: encryptedUserKeyPair.pubKey,
      userPrvKey: encryptedUserKeyPair.prvKey,
      backupPubKey: encryptedBackupKeyPair.pubKey,
      backupPrvKey: encryptedBackupKeyPair.prvKey,
    }
    const { id, keys, servicePubKey } = await backendApi.createWallet(
      userToken,
      backendRequestParams,
    )

    const pdf = await generatePdf(
      params.name,
      servicePubKey,
      backendRequestParams.userPrvKey,
      backendRequestParams.backupPrvKey,
    )

    return { id, keys, pdf }
  }

  const editWallet = (
    userToken: string,
    walletId: string,
    newName: string,
  ): Promise<{}> => backendApi.editWallet(userToken, walletId, newName)

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

  const listUnspents = (
    token: string,
    walletId: string,
    recipients: Recipient[],
    feeRate?: number,
  ): Promise<ListUnspentsResponse> => {
    const params: GetUtxosBackendParams = {
      feeRate,
      recipients: recipients.map((r: Recipient) => ({
        address: r.address,
        amount: r.amount.toString(),
      })),
    }
    return backendApi.listUnspents(token, walletId, params)
  }

  const maxTransferAmount = (
    token: string,
    walletId: string,
    feeRate: number,
    recipient: string,
  ): Promise<MaxTransferAmountResponse> => {
    const params: MaxTransferAmountBitcoinBackendParams = {
      recipient,
      feeRate,
    }
    return backendApi.maxTransferAmount(token, walletId, params)
  }

  const listPoliciesForWallet = (
    token: string,
    walletId: string,
  ): Promise<ListPoliciesForWalletResponse> => {
    return backendApi.listPoliciesForWallet(token, walletId)
  }

  const listUtxosByAddress = (
    token: string,
    walletId: string,
    address: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListUtxosByAddressBackendResponse> => {
    return backendApi.listUtxosByAddress(
      token,
      walletId,
      address,
      limit,
      nextPageToken,
    )
  }

  return {
    createWallet,
    editWallet,
    getWallet,
    listUnspents,
    listWallets,
    maxTransferAmount,
    listPoliciesForWallet,
    listUtxosByAddress,
  }
}
