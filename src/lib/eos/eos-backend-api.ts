import {
  CreateEosWalletBackendParams,
  MaxTransferAmountEosBackendParams,
  CreateEosWalletBackendResponse,
  GetWalletBackendResponse,
  ListWalletsBackendResponse,
  MaxTransferAmountBackendResponse,
  GetCurrentTxParamsResponse,
} from '../../types/api/wallet'
import { ListPoliciesForWalletBackendResponse } from '../../types/api/policy'

import { Currency } from '../..'
import * as backendApi from '../backend-api'
import { HttpClient } from '../utils/httpClient'
import {
  GetServiceFeeResponse,
  SendResponse,
} from '../../types/response/transaction'
import { GetKeyBackendResponse } from '../../types/api/key'
import { GetAccountFee, GetReferentialAccountId } from 'response/account-fee'
import {
  CreateWebhookBackendResponse,
  DeleteWebhookBackendResponse,
  GetWebhookBackendResponse,
  ListWebhooksBackendResponse
} from "api"

export interface EosBackendApi {
  createWallet(
    token: string,
    params: CreateEosWalletBackendParams,
  ): Promise<CreateEosWalletBackendResponse>
  editWallet(token: string, walletId: string, name: string): Promise<any>
  getWallet(token: string, walletId: string): Promise<GetWalletBackendResponse>
  listWallets(
    token: string,
    limit: number,
    searchPhrase?: string,
    nextPageToken?: string,
  ): Promise<ListWalletsBackendResponse>
  maxTransferAmount(
    token: string,
    walletId: string,
    params: MaxTransferAmountEosBackendParams,
  ): Promise<MaxTransferAmountBackendResponse>
  listPoliciesForWallet(
    token: string,
    walletId: string,
  ): Promise<ListPoliciesForWalletBackendResponse>
  sendTransaction(
    token: string,
    walletId: string,
    txHex: string,
    signature: string,
  ): Promise<SendResponse>
  getKey(
    token: string,
    keyId: string,
    includePrivate?: boolean,
  ): Promise<GetKeyBackendResponse>
  getCurrentTxParams(): Promise<GetCurrentTxParamsResponse>
  getAccountFee(token: string): Promise<GetAccountFee>
  getReferentialAccountId(token: string): Promise<GetReferentialAccountId>
  getServiceFee(
    token: string,
    walletId: string,
    recipient: string,
    transferAmount: string,
  ): Promise<GetServiceFeeResponse>,
  createWebhook(
    token: string,
    walletId: string,
    callbackUrl: string,
    settings: Object,
  ): Promise<CreateWebhookBackendResponse>,
  listWebhooks(
    token: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListWebhooksBackendResponse>,
  getWebhook(
    token: string,
    walletId: string,
    webhookId: string,
  ): Promise<GetWebhookBackendResponse>,
  deleteWebhook(
    token: string,
    walletId: string,
    webhookId: string,
  ): Promise<DeleteWebhookBackendResponse>
}

export const eosBackendApiFactory = (
  backendApiUrl: string,
  httpClient: HttpClient,
): EosBackendApi => {
  const baseCurrencyApi = backendApi.currencyApi(
    backendApiUrl,
    Currency.EOS,
    httpClient,
  )

  const maxTransferAmount = async (
    token: string,
    walletId: string,
    params: MaxTransferAmountEosBackendParams,
  ): Promise<MaxTransferAmountBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }

    const response = await httpClient.request(
      `${backendApiUrl}/eos/wallet/${walletId}/max-transfer-amount?recipient=${params.recipient}`,
      options,
    )
    return response.data
  }

  const getCurrentTxParams = async (): Promise<GetCurrentTxParamsResponse> => {
    const options = {
      method: 'GET',
    }
    const response = await httpClient.request(
      `${backendApiUrl}/eos/tx/params`,
      options,
    )
    return response.data
  }

  const sendTransaction = async (
    token: string,
    walletId: string,
    txHex: string,
    signature: string,
  ): Promise<SendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify({
        txHex,
        signature,
      }),
    }

    const response = await httpClient.request(
      `${backendApiUrl}/eos/wallet/${walletId}/send`,
      options,
    )
    return response.data
  }

  const getAccountFee = async (token: string): Promise<GetAccountFee> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }
    const response = await httpClient.request(
      `${backendApiUrl}/eos/account-fee`,
      options,
    )
    return response.data
  }

  const getReferentialAccountId = async (token: string): Promise<GetReferentialAccountId> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }
    const response = await httpClient.request(
      `${backendApiUrl}/eos/user-reference-for-fee`,
      options,
    )
    return response.data
  }

  const getServiceFee = async (
    token: string,
    walletId: string,
    recipient: string,
    transferAmount: string,
  ): Promise<GetServiceFeeResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }
    const response = await httpClient.request(
      `${backendApiUrl}/eos/wallet/${walletId}/service-fee?recipient=${recipient}&transferAmount=${transferAmount}`,
      options,
    )
    return response.data
  }

  return {
    createWallet: baseCurrencyApi.createWallet,
    editWallet: baseCurrencyApi.editWallet,
    getWallet: baseCurrencyApi.getWallet,
    listWallets: baseCurrencyApi.listWallets,
    maxTransferAmount,
    listPoliciesForWallet: baseCurrencyApi.listPoliciesForWallet,
    getCurrentTxParams,
    getKey: baseCurrencyApi.getKey,
    sendTransaction,
    getAccountFee,
    getReferentialAccountId,
    getServiceFee,
    createWebhook: baseCurrencyApi.createWebhook,
    listWebhooks: baseCurrencyApi.listWebhooks,
    getWebhook: baseCurrencyApi.getWebhook,
    deleteWebhook: baseCurrencyApi.deleteWebhook
  }
}
