import {
  CreateEosWalletBackendResponse,
  CreateWalletBackendParams,
  GetWalletBackendResponse,
  ListPoliciesForWalletResponse,
  ListWalletsBackendResponse,
  MaxTransferAmountEosParams,
  MaxTransferAmountResponse
} from 'response'
import { Currency } from '../../types/domain'
import * as backendApi from "../backend-api";
import request from "../utils/request";

export interface EosBackendApi {
  createWallet(token: string, params: CreateWalletBackendParams): Promise<CreateEosWalletBackendResponse>,
  editWallet(token: string, walletId: string, name:string): Promise<any>,
  getWallet(token: string, walletId: string): Promise<GetWalletBackendResponse>,
  listWallets(token: string, limit: number, searchPhrase?:string, nextPageToken?: string): Promise<ListWalletsBackendResponse>,
  maxTransferAmount(token: string, walletId: string, params: MaxTransferAmountEosParams): Promise<MaxTransferAmountResponse>
  listPoliciesForWallet(token: string, walletId: string): Promise<ListPoliciesForWalletResponse>
}

export const create = (backendApiUrl: string): EosBackendApi => {

  const baseCurrencyApi = backendApi.currencyApi(backendApiUrl, Currency.EOS)

  const maxTransferAmount = async (token: string, walletId: string, params: MaxTransferAmountEosParams): Promise<MaxTransferAmountResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const response = await request(`${backendApiUrl}/eos/wallet/${walletId}/max-transfer-amount?recipient=${params.recipient}`, options)
    return response.data
  }

  return {
    createWallet: baseCurrencyApi.createWallet,
    editWallet: baseCurrencyApi.editWallet,
    getWallet: baseCurrencyApi.getWallet,
    listWallets: baseCurrencyApi.listWallets,
    maxTransferAmount: maxTransferAmount,
    listPoliciesForWallet: baseCurrencyApi.listPoliciesForWallet
  }
}
