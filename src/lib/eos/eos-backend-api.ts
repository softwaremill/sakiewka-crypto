import {
  CreateWalletBackendParams,
  MaxTransferAmountEosBackendParams,
  CreateEosWalletBackendResponse,
  GetWalletBackendResponse,
  ListWalletsBackendResponse,
  MaxTransferAmountBackendResponse,
} from '../../types/api/wallet'
import { ListPoliciesForWalletBackendResponse } from '../../types/api/policy'

import { Currency } from '../..'
import * as backendApi from '../backend-api'
import { HttpClient } from '../utils/httpClient'

export interface EosBackendApi {
  createWallet(
    token: string,
    params: CreateWalletBackendParams,
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
      `${backendApiUrl}/eos/wallet/${walletId}/max-transfer-amount?recipient=${
        params.recipient
      }`,
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
  }
}
