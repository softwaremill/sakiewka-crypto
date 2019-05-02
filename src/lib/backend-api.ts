import {
  ChainInfoResponse as ChainModeResponse,
  Confirm2faBackendResponse,
  CreateNewAddressBackendResponse,
  CreateWalletBackendParams,
  CreateWalletBackendResponse,
  CreateWebhookResponse,
  DeleteWebhookResponse,
  Disable2faBackendResponse,
  GetAddressBackendResponse,
  GetFeesRates,
  GetKeyBackendResponse,
  GetUtxosBackendParams,
  GetWalletBackendResponse,
  GetWebhooksResponse,
  InfoBackendResponse,
  Init2faBackendResponse,
  ListAddressesBackendResponse,
  ListTransfersBackendResponse,
  ListUnspentsBackendResponse,
  ListWalletsBackendResponse,
  ListWebhooksResponse,
  LoginBackendResponse,
  MaxTransferAmountParams,
  MaxTransferAmountResponse,
  MontlySummaryBackendResponse,
  RegisterBackendResponse,
  SetupPasswordBackendResponse,
  TransferItemBackendResponse
} from 'response'
import request from './utils/request'
import { Currency } from '../types/domain';
import { WebhookType } from './constants';

export interface SakiewkaBackend {
  core: BaseBackendApi,
  [Currency.BTC]: CurrencyBackendApi,
  [Currency.BTG]: CurrencyBackendApi
}

export const backendFactory = (backendApiUrl: string): SakiewkaBackend => {
  const backendApi = create(backendApiUrl)
  const btcBackendApi = withCurrency(backendApiUrl, Currency.BTC)
  const btgBackendApi = withCurrency(backendApiUrl, Currency.BTG)
  return {
    core: backendApi,
    [Currency.BTC]: btcBackendApi,
    [Currency.BTG]: btgBackendApi
  }
}

export interface BaseBackendApi {
  login(login: string, password: string, codeIn?: number): Promise<LoginBackendResponse>
  init2fa(token: string, password: string): Promise<Init2faBackendResponse>
  confirm2fa(token: string, password: string, code: number): Promise<Confirm2faBackendResponse>
  disable2fa(token: string, password: string, code: number): Promise<Disable2faBackendResponse>
  register(login: string): Promise<RegisterBackendResponse>
  setupPassword(token: string, password: String): Promise<SetupPasswordBackendResponse>
  info(token: string): Promise<InfoBackendResponse>
  monthlySummary(token: string, month: number, year: number, fiatCurrency: string): Promise<MontlySummaryBackendResponse>
  listTransfers(token: string, limit: number, nextPageToken?: string): Promise<ListTransfersBackendResponse>
  chainNetworkType(): Promise<ChainModeResponse>
}

export const create = (backendApiUrl: string): BaseBackendApi => {
  // BTC
  // user
  const login = async (login: string, password: string, codeIn?: number): Promise<LoginBackendResponse> => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        password,
        email: login,
        code: codeIn
      })
    }
    const response = await request(`${backendApiUrl}/user/login`, options)
    return response.data
  }

  const init2fa = async (token: string, password: string): Promise<Init2faBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({ password })
    }
    const response = await request(`${backendApiUrl}/user/2fa/init`, options)
    return response.data
  }

  const confirm2fa = async (token: string, password: string, code: number): Promise<Confirm2faBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({ password, code })
    }
    const response = await request(`${backendApiUrl}/user/2fa/confirm`, options)
    return response.data
  }

  const disable2fa = async (token: string, password: string, code: number): Promise<Disable2faBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({ password, code })
    }
    const response = await request(`${backendApiUrl}/user/2fa/disable`, options)
    return response.data
  }

  const register = async (login: string): Promise<RegisterBackendResponse> => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        email: login
      })
    }

    const response = await request(`${backendApiUrl}/user/register`, options)
    return response.data
  }

  const setupPassword = async (token: string, password: String): Promise<SetupPasswordBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({
        password
      })
    }
    const response = await request(`${backendApiUrl}/user/setup-password`, options)
    return response.data
  }

  const info = async (token: string): Promise<InfoBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const response = await request(`${backendApiUrl}/user/info`, options)
    return response.data
  }

  const monthlySummary = async (token: string, month: number, year: number, fiatCurrency: string): Promise<MontlySummaryBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const response = await request(`${backendApiUrl}/transfers/monthly-summary/${month}/${year}/${fiatCurrency}`, options)
    return response.data
  }

  const listTransfers = async (token: string,
                               limit: number,
                               nextPageToken?: string): Promise<ListTransfersBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }
    const nextPageParam = nextPageToken ? `&nextPageToken=${nextPageToken}` : ''
    const queryString = `?limit=${limit}${nextPageParam}`

    const response = await request(`${backendApiUrl}/transfers${queryString}`, options)
    return response.data
  }

  const chainNetworkType = async (): Promise<ChainModeResponse> => {
    const options = { method: 'GET' }
    const response = await request(`${backendApiUrl}/chain-network-type`, options)
    return response.data
  }

  return {
    login,
    init2fa,
    confirm2fa,
    disable2fa,
    register,
    setupPassword,
    info,
    monthlySummary,
    listTransfers,
    chainNetworkType
  }
}

export interface CurrencyBackendApi {
  createNewAddress(token: string, walletId: string, change: boolean, name?: string): Promise<CreateNewAddressBackendResponse>,
  createWallet(token: string, params: CreateWalletBackendParams): Promise<CreateWalletBackendResponse>,
  getAddress(token: string, walletId: string, address: string): Promise<GetAddressBackendResponse>,
  getKey(token: string, keyId: string, includePrivate?: boolean): Promise<GetKeyBackendResponse>,
  getWallet(token: string, walletId: string): Promise<GetWalletBackendResponse>,
  listAddresses(token: string, walletId: string, limit: number, nextPageToken?: string): Promise<ListAddressesBackendResponse>,
  listUnspents(token: string, walletId: string, params: GetUtxosBackendParams): Promise<ListUnspentsBackendResponse>,
  listWallets(token: string, limit: number, nextPageToken?: string): Promise<ListWalletsBackendResponse>,
  sendTransaction(token: string, walletId: string, txHex: string): Promise<any>,
  getFeesRates(): Promise<GetFeesRates>,
  maxTransferAmount(token: string, walletId: string, params: MaxTransferAmountParams): Promise<MaxTransferAmountResponse>
  createWebhook(token: string, walletId: string, callbackUrl: string, type: WebhookType, settings: Object): Promise<CreateWebhookResponse>
  listWebhooks(token: string, walletId: string, limit: number, nextPageToken?: string): Promise<ListWebhooksResponse>
  getWebhook(token: string, walletId: string, webhookId: string): Promise<GetWebhooksResponse>
  deleteWebhook(token: string, walletId: string, webhookId: string): Promise<DeleteWebhookResponse>
  listTransfers(token: string, walletId: string, limit: number, nextPageParam?: string): Promise<ListTransfersBackendResponse>
  findTransferByTxHash(token: string, walletId: string, txHash: string): Promise<TransferItemBackendResponse>
}

export const withCurrency = (backendApiUrl: string, currency: Currency): CurrencyBackendApi => {

  // wallet
  const createWallet = async (
    token: string,
    params: CreateWalletBackendParams
  ): Promise<CreateWalletBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({
        ...params
      })
    }

    const response = await request(`${backendApiUrl}/${currency}/wallet`, options)
    return response.data
  }

  const getWallet = async (
    token: string,
    walletId: string
  ): Promise<GetWalletBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const response = await request(`${backendApiUrl}/${currency}/wallet/${walletId}`, options)
    return response.data
  }

  const listWallets = async (
    token: string,
    limit: number,
    nextPageToken?: string
  ): Promise<ListWalletsBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const queryString = `limit=${limit}${nextPageToken ? `&nextPageToken=${nextPageToken}` : ''}`

    const response = await request(`${backendApiUrl}/${currency}/wallet?${queryString}`, options)
    return response.data
  }

  const listWebhooks = async (
    token: string,
    walletId: string,
    limit: number,
    nextPageToken?: string
  ): Promise<ListWebhooksResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }
    const queryString = `limit=${limit}${nextPageToken ? `&nextPageToken=${nextPageToken}` : ''}`
    const response = await request(`${backendApiUrl}/${currency}/wallet/${walletId}/webhooks?${queryString}`, options)
    return response.data
  }

  const getWebhook = async (
    token: string,
    walletId: string,
    webhookId: string
  ): Promise<GetWebhooksResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }
    const response = await request(`${backendApiUrl}/${currency}/wallet/${walletId}/webhooks/${webhookId}`, options)
    return response.data
  }

  const createWebhook = async (
    token: string,
    walletId: string,
    callbackUrl: string,
    type: WebhookType,
    settings: Object
  ): Promise<CreateWebhookResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({
        callbackUrl,
        settings: {
          type,
          ...settings
        }
      })
    }
    const response = await request(`${backendApiUrl}/${currency}/wallet/${walletId}/webhooks`, options)
    return response.data
  }

  const deleteWebhook = async (
    token: string,
    walletId: string,
    webhookId: string
  ): Promise<DeleteWebhookResponse> => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: token
      }
    }
    const response = await request(`${backendApiUrl}/${currency}/wallet/${walletId}/webhooks/${webhookId}`, options)
    return response.data
  }

  const createNewAddress = async (token: string, walletId: string, change: boolean = false, name?: string
  ): Promise<CreateNewAddressBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({
        name
      })
    }

    const response = await request(`${backendApiUrl}/${currency}/wallet/${walletId}/address?change=${change}`, options)
    return response.data
  }

  const getAddress = async (token: string, walletId: string, address: string): Promise<GetAddressBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const response = await request(`${backendApiUrl}/${currency}/wallet/${walletId}/address/${address}`, options)
    return response.data
  }

  const listAddresses = async (
    token: string,
    walletId: string,
    limit: number,
    nextPageToken?: string
  ): Promise<ListAddressesBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const queryString = `limit=${limit}${nextPageToken ? `&nextPageToken=${nextPageToken}` : ''}`

    const response = await request(`${backendApiUrl}/${currency}/wallet/${walletId}/address?${queryString}`, options)
    return response.data
  }

  const listUnspents = async (token: string, walletId: string, params: GetUtxosBackendParams): Promise<ListUnspentsBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({
        ...params
      })
    }

    const response = await request(`${backendApiUrl}/${currency}/wallet/${walletId}/utxo`, options)
    return response.data
  }

  // transaction
  const sendTransaction = async (token: string, walletId: string, txHex: string): Promise<string> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({
        txHex
      })
    }

    const response = await request(`${backendApiUrl}/${currency}/wallet/${walletId}/send`, options)
    return response.data
  }

  const getKey = async (
    token: string,
    keyId: string,
    includePrivate?: boolean
  ): Promise<GetKeyBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const response = await request(`${backendApiUrl}/${currency}/key/${keyId}${includePrivate ? `?includePrivate=${includePrivate}` : ''}`, options)
    return response.data
  }

  const maxTransferAmount = async (token: string, walletId: string, params: MaxTransferAmountParams): Promise<MaxTransferAmountResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const response = await request(`${backendApiUrl}/${currency}/wallet/${walletId}/max-transfer-amount?recipient=${params.recipient}&feeRate=${params.feeRate}`, options)
    return response.data
  }

  const getFeesRates = async (): Promise<GetFeesRates> => {
    const response = await request(`${backendApiUrl}/${currency}/fees`, { method: 'GET' })
    return response.data
  }

  const listTransfers = async (token: string, walletId: string, limit: number, nextPageToken?: string): Promise<ListTransfersBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }
    const nextPageParam = nextPageToken ? `&nextPageToken=${nextPageToken}` : ''
    const queryString = `?limit=${limit}${nextPageParam}`

    const response = await request(`${backendApiUrl}/${currency}/wallet/${walletId}/transfers${queryString}`, options)
    return response.data
  }

  const findTransferByTxHash = async(token: string, walletId: string, txHash: string): Promise<TransferItemBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const response = await request(`${backendApiUrl}/${currency}/wallet/${walletId}/transfers/${txHash}`, options)
    return response.data
  }

  return {
    createNewAddress,
    createWallet,
    getAddress,
    getKey,
    getWallet,
    listAddresses,
    listUnspents,
    listWallets,
    sendTransaction,
    getFeesRates,
    maxTransferAmount,
    listWebhooks,
    getWebhook,
    deleteWebhook,
    createWebhook,
    listTransfers,
    findTransferByTxHash
  }
}
