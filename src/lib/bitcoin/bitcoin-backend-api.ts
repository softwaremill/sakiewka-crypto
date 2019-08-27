import {
  AssignPolicyBackendParams,
  AssignPolicyBackendResponse,
  ListPoliciesBackendResponse,
  ListWalletsForPolicyBackendResponse,
  CreatePolicyBackendResponse,
  CreatePolicyBackendParams,
  ListPoliciesForWalletBackendResponse,
} from '../../types/api/policy'
import {
  FindTransferByTxHashBackendResponse,
  ListTransfersBackendResponse,
} from '../../types/api/transfer'
import { SendBackendResponse } from '../../types/api/transaction'
import {
  CreateWebhookBackendResponse,
  DeleteWebhookBackendResponse,
  GetWebhookBackendResponse,
  ListWebhooksBackendResponse,
} from '../../types/api/webhook'
import { GetKeyBackendResponse } from '../../types/api/key'
import { GetFeeRatesBackendResponse } from '../../types/api/feeRates'
import {
  CreateNewBitcoinAddressBackendResponse,
  GetBitcoinAddressBackendResponse,
  ListBitcoinAddressesBackendResponse,
} from '../../types/api/address'
import {
  CreateWalletBackendParams,
  MaxTransferAmountBitcoinBackendParams,
  GetUtxosBackendParams,
  CreateBitcoinWalletBackendResponse,
  GetWalletBackendResponse,
  ListWalletsBackendResponse,
  ListUnspentsBackendResponse,
  MaxTransferAmountBackendResponse,
  ListUtxosByAddressBackendResponse,
} from '../../types/api/wallet'
import { HttpClient } from '../utils/httpClient'
import * as backendApi from '../backend-api'
import { Currency } from '../../types/domain/currency'
import { GetExchangeRatesResponse } from 'response/exchangeRates'
import { FiatCurrency } from 'domain/exchangeRates'

export interface BitcoinBackendApi {
  createNewAddress(
    token: string,
    walletId: string,
    change: boolean,
    name?: string,
  ): Promise<CreateNewBitcoinAddressBackendResponse>
  createWallet(
    token: string,
    params: CreateWalletBackendParams,
  ): Promise<CreateBitcoinWalletBackendResponse>
  editWallet(token: string, walleetId: string, name: string): Promise<any>
  getAddress(
    token: string,
    walletId: string,
    address: string,
  ): Promise<GetBitcoinAddressBackendResponse>
  getKey(
    token: string,
    keyId: string,
    includePrivate?: boolean,
  ): Promise<GetKeyBackendResponse>
  getWallet(token: string, walletId: string): Promise<GetWalletBackendResponse>
  listAddresses(
    token: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListBitcoinAddressesBackendResponse>
  listUnspents(
    token: string,
    walletId: string,
    params: GetUtxosBackendParams,
  ): Promise<ListUnspentsBackendResponse>
  listWallets(
    token: string,
    limit: number,
    searchPhrase?: string,
    nextPageToken?: string,
  ): Promise<ListWalletsBackendResponse>
  sendTransaction(
    token: string,
    walletId: string,
    txHex: string,
  ): Promise<SendBackendResponse>
  getFeeRates(): Promise<GetFeeRatesBackendResponse>
  getExchangeRates(
    fiatCurrency: FiatCurrency,
    fromDate: string,
    toDate: string,
  ): Promise<GetExchangeRatesResponse>
  maxTransferAmount(
    token: string,
    walletId: string,
    params: MaxTransferAmountBitcoinBackendParams,
  ): Promise<MaxTransferAmountBackendResponse>
  createWebhook(
    token: string,
    walletId: string,
    callbackUrl: string,
    settings: Object,
  ): Promise<CreateWebhookBackendResponse>
  listUtxosByAddress(
    token: string,
    walletId: string,
    address: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListUtxosByAddressBackendResponse>
  listWebhooks(
    token: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListWebhooksBackendResponse>
  getWebhook(
    token: string,
    walletId: string,
    webhookId: string,
  ): Promise<GetWebhookBackendResponse>
  deleteWebhook(
    token: string,
    walletId: string,
    webhookId: string,
  ): Promise<DeleteWebhookBackendResponse>
  listTransfers(
    token: string,
    walletId: string,
    limit: number,
    nextPageParam?: string,
  ): Promise<ListTransfersBackendResponse>
  findTransferByTxHash(
    token: string,
    walletId: string,
    txHash: string,
  ): Promise<FindTransferByTxHashBackendResponse>
  createPolicy(
    token: string,
    params: CreatePolicyBackendParams,
  ): Promise<CreatePolicyBackendResponse>
  listPoliciesForWallet(
    token: string,
    walletId: string,
  ): Promise<ListPoliciesForWalletBackendResponse>
  listPolicies(
    token: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListPoliciesBackendResponse>
  assignPolicy(
    token: string,
    policyId: string,
    params: AssignPolicyBackendParams,
  ): Promise<AssignPolicyBackendResponse>
  listWalletsForPolicy(
    token: string,
    policyId: string,
  ): Promise<ListWalletsForPolicyBackendResponse>
}

export const withCurrency = (
  backendApiUrl: string,
  currency: Currency,
  httpClient: HttpClient,
): BitcoinBackendApi => {
  const currencyApi = backendApi.currencyApi(
    backendApiUrl,
    currency,
    httpClient,
  )

  const listUtxosByAddress = async (
    token: string,
    walletId: string,
    address: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListUtxosByAddressBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }
    const queryString = `limit=${limit}${
      nextPageToken ? `&nextPageToken=${nextPageToken}` : ''
    }`
    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/wallet/${walletId}/${address}/utxo?${queryString}`,
      options,
    )
    return response.data
  }

  const createNewAddress = async <CreateNewBitcoinAddressBackendResponse>(
    token: string,
    walletId: string,
    isChange: boolean = false,
    name?: string,
  ): Promise<CreateNewBitcoinAddressBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify({
        name,
        isChange,
      }),
    }

    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/wallet/${walletId}/address`,
      options,
    )
    return response.data
  }

  const listUnspents = async (
    token: string,
    walletId: string,
    params: GetUtxosBackendParams,
  ): Promise<ListUnspentsBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify({
        ...params,
      }),
    }

    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/wallet/${walletId}/utxo`,
      options,
    )
    return response.data
  }

  const sendTransaction = async (
    token: string,
    walletId: string,
    txHex: string,
  ): Promise<SendBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify({
        txHex,
      }),
    }

    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/wallet/${walletId}/send`,
      options,
    )
    return response.data
  }

  const maxTransferAmount = async (
    token: string,
    walletId: string,
    params: MaxTransferAmountBitcoinBackendParams,
  ): Promise<MaxTransferAmountBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }

    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/wallet/${walletId}/max-transfer-amount?recipient=${params.recipient}&feeRate=${params.feeRate}`,
      options,
    )
    return response.data
  }

  const getFeeRates = async (): Promise<GetFeeRatesBackendResponse> => {
    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/fees`,
      { method: 'GET' },
    )
    return response.data
  }

  const getExchangeRates = async (
    fiatCurrency: FiatCurrency,
    fromDate: string,
    toDate: string,
  ): Promise<GetExchangeRatesResponse> => {
    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/rates/${fiatCurrency}?fromDate=${fromDate}&toDate=${toDate}`,
      { method: 'GET' },
    )
    return response.data
  }

  return {
    createNewAddress,
    createWallet: currencyApi.createWallet,
    editWallet: currencyApi.editWallet,
    getAddress: currencyApi.getAddress,
    getKey: currencyApi.getKey,
    getWallet: currencyApi.getWallet,
    listAddresses: currencyApi.listAddresses,
    listUnspents,
    listWallets: currencyApi.listWallets,
    sendTransaction,
    getFeeRates,
    getExchangeRates,
    maxTransferAmount,
    listUtxosByAddress,
    listWebhooks: currencyApi.listWebhooks,
    getWebhook: currencyApi.getWebhook,
    deleteWebhook: currencyApi.deleteWebhook,
    createWebhook: currencyApi.createWebhook,
    listTransfers: currencyApi.listTransfers,
    findTransferByTxHash: currencyApi.findTransferByTxHash,
    createPolicy: currencyApi.createPolicy,
    listPoliciesForWallet: currencyApi.listPoliciesForWallet,
    listPolicies: currencyApi.listPolicies,
    assignPolicy: currencyApi.assignPolicy,
    listWalletsForPolicy: currencyApi.listWalletsForPolicy,
  }
}
