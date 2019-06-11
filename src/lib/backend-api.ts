import {
  AssignPolicyBackendParams,
  ChainInfoResponse as ChainModeResponse,
  Confirm2faBackendResponse,
  CreateWalletBackendParams,
  CreateWebhookResponse,
  DeleteWebhookResponse,
  Disable2faBackendResponse,
  GetKeyBackendResponse,
  GetWalletBackendResponse,
  GetWebhooksResponse,
  InfoBackendResponse,
  Init2faBackendResponse,
  ListAddressesBackendResponse,
  ListPoliciesForWalletResponse,
  ListPoliciesResponse,
  ListTransfersBackendResponse,
  ListWalletsBackendResponse,
  ListWalletsForPolicyResponse,
  ListWebhooksResponse,
  LoginBackendResponse,
  MontlySummaryBackendResponse,
  PolicyCreateRequest,
  RegisterBackendResponse,
  SetupPasswordBackendResponse,
  TransferItemBackendResponse
} from 'response'
import request from './utils/request'
import { Currency } from '../types/domain'
import * as bitcoinBackendFactory from './bitcoin/bitcoin-backend-api';

export interface SakiewkaBackend {
  core: CoreBackendApi,
  [Currency.BTC]: bitcoinBackendFactory.BitcoinBackendApi,
  [Currency.BTG]: bitcoinBackendFactory.BitcoinBackendApi
}

export const backendFactory = (backendApiUrl: string): SakiewkaBackend => {
  const backendApi = create(backendApiUrl)
  const btcBackendApi = bitcoinBackendFactory.withCurrency(backendApiUrl, Currency.BTC)
  const btgBackendApi = bitcoinBackendFactory.withCurrency(backendApiUrl, Currency.BTG)
  return {
    core: backendApi,
    [Currency.BTC]: btcBackendApi,
    [Currency.BTG]: btgBackendApi
  }
}

export interface CoreBackendApi {
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

export const create = (backendApiUrl: string): CoreBackendApi => {
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

    const response = await request(`${backendApiUrl}/transfer/monthly-summary/${month}/${year}/${fiatCurrency}`, options)
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

    const response = await request(`${backendApiUrl}/transfer${queryString}`, options)
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


export const currencyApi = (backendApiUrl: string, currency: Currency) => {
  // wallet
  const createWallet = async <T>(
    token: string,
    params: CreateWalletBackendParams
  ): Promise<T> => {
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
    settings: Object
  ): Promise<CreateWebhookResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({ callbackUrl, settings })
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


  const getAddress = async <T>(token: string, walletId: string, address: string): Promise<T> => {
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

  const createPolicy = async (token: string, params: PolicyCreateRequest): Promise<any> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: JSON.stringify(params)
    }

    const response = await request(`${backendApiUrl}/${currency}/policy`, options)
    return response.data
  }

  const listPoliciesForWallet = async (token: string, walletId: string): Promise<ListPoliciesForWalletResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const response = await request(`${backendApiUrl}/${currency}/wallet/${walletId}/policy`, options)
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

    const response = await request(`${backendApiUrl}/${currency}/wallet/${walletId}/transfer${queryString}`, options)
    return response.data
  }

  const findTransferByTxHash = async (token: string, walletId: string, txHash: string): Promise<TransferItemBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }
    const response = await request(`${backendApiUrl}/${currency}/wallet/${walletId}/transfer/${txHash}`, options)
    return response.data
  }

  const listPolicies = async (token: string, limit: number, nextPageToken?: string): Promise<ListPoliciesResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }
    const nextPageParam = nextPageToken ? `&nextPageToken=${nextPageToken}` : ''
    const queryString = `?limit=${limit}${nextPageParam}`

    const response = await request(`${backendApiUrl}/${currency}/policy${queryString}`, options)
    return response.data
  }

  const assignPolicy = async (token: string, policyId: string, assignParams: AssignPolicyBackendParams): Promise<any> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: JSON.stringify(assignParams)
    }

    const response = await request(`${backendApiUrl}/${currency}/policy/${policyId}/assign`, options)
    return response.data
  }

  const listWalletsForPolicy = async (token: string, policyId: string): Promise<ListWalletsForPolicyResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }
    const response = await request(`${backendApiUrl}/${currency}/policy/${policyId}/wallet`, options)
    return response.data
  }

  return {
    createWallet,
    getAddress,
    getKey,
    getWallet,
    listAddresses,
    listWallets,
    listWebhooks,
    getWebhook,
    deleteWebhook,
    createWebhook,
    listTransfers,
    findTransferByTxHash,
    createPolicy,
    listPoliciesForWallet,
    listPolicies,
    assignPolicy,
    listWalletsForPolicy
  }
}