import { Recipient, WalletParams } from '../../types/domain'
import { ROOT_DERIVATION_PATH } from '../constants'
import {
  CreateWalletBackendParams,
  GetUtxosBackendParams,
  MaxTransferAmountBitcoinParams,
  ReceipientsBackend,
  MaxTransferAmountResponse,
  ListUnspentsBackendResponse,
  ListWalletsBackendResponse,
  GetWalletBackendResponse,
  ListPoliciesForWalletResponse,
  ListUtxosByAddressBackendResponse,
} from '../../types/response'
import { generatePdf } from './bitcoin-keycard-pdf'
import { KeyModule } from './bitcoin-key'
import { BitcoinBackendApi } from './bitcoin-backend-api'

export interface WalletApi {
  createWallet(userToken: string, params: WalletParams): Promise<any>
  editWallet(
    userToken: string,
    walletId: string,
    newName: string,
  ): Promise<any>
  getWallet(
    userToken: string,
    walletId: string,
  ): Promise<GetWalletBackendResponse>
  listWallets(
    userToken: string,
    limit: number,
    searchPhrase?: string,
    nextPageToken?: string,
  ): Promise<ListWalletsBackendResponse>
  listUnspents(
    token: string,
    walletId: string,
    recipients: Recipient[],
    feeRate?: number,
  ): Promise<ListUnspentsBackendResponse>
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
    params: WalletParams,
  ): Promise<any> => {
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

    const backendRequestParams = {
      name: params.name,
      userPubKey: encryptedUserKeyPair.pubKey,
      userPrvKey: encryptedUserKeyPair.prvKey,
      backupPubKey: encryptedBackupKeyPair.pubKey,
      backupPrvKey: encryptedBackupKeyPair.prvKey,
    }
    const response = await backendApi.createWallet(userToken, <
      CreateWalletBackendParams
    >backendRequestParams)
    const pdf = await generatePdf(
      params.name,
      response.servicePubKey,
      backendRequestParams.userPrvKey,
      backendRequestParams.backupPrvKey,
    )

    return { ...response, pdf }
  }

  const editWallet = (
    userToken: string,
    walletId: string,
    newName: string,
  ): Promise<any> => {
    return backendApi.editWallet(userToken, walletId, newName)
  }

  const getWallet = (
    userToken: string,
    walletId: string,
  ): Promise<GetWalletBackendResponse> =>
    backendApi.getWallet(userToken, walletId)

  const listWallets = (
    userToken: string,
    limit: number,
    searchPhrase?: string,
    nextPageToken?: string,
  ): Promise<ListWalletsBackendResponse> =>
    backendApi.listWallets(userToken, limit, searchPhrase, nextPageToken)

  const listUnspents = (
    token: string,
    walletId: string,
    recipients: Recipient[],
    feeRate?: number,
  ): Promise<ListUnspentsBackendResponse> => {
    const params = {
      feeRate,
      recipients: recipients.map(
        (r: Recipient) =>
          <ReceipientsBackend>{
            address: r.address,
            amount: r.amount.toString(),
          },
      ),
    }
    return backendApi.listUnspents(token, walletId, <GetUtxosBackendParams>(
      params
    ))
  }

  const maxTransferAmount = (
    token: string,
    walletId: string,
    feeRate: number,
    recipient: string,
  ): Promise<MaxTransferAmountResponse> => {
    const params: MaxTransferAmountBitcoinParams = {
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
