import {
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
  ListTransfersBackendResponse,
  ListWalletsBackendResponse,
  ListWebhooksResponse,
  LoginBackendResponse,
  MontlySummaryBackendResponse,
  RegisterBackendResponse,
  SetupPasswordBackendResponse,
  TransferItemBackendResponse,
  ListPoliciesForWalletResponse,
  ListPoliciesResponse,
  AssignPolicyBackendParams,
  ListWalletsForPolicyResponse,
  PolicyCreateRequest,
  BalanceBackendResponse,
  CreateAuthTokenBackendResponse,
  DeleteAuthTokenBackendResponse
} from 'response'
import { buildQueryParamString, requestWithCorrelationId } from './utils/request'
import { Currency } from '..'
import * as bitcoinBackendFactory from './bitcoin/bitcoin-backend-api'

export interface SakiewkaBackend {
  core: CoreBackendApi,
  [Currency.BTC]: bitcoinBackendFactory.BitcoinBackendApi,
  [Currency.BTG]: bitcoinBackendFactory.BitcoinBackendApi
}

export type CorrelationIdGetter = () => string

export const backendFactory = (backendApiUrl: string, getCorrelationId: CorrelationIdGetter): SakiewkaBackend => {
  const backendApi = create(backendApiUrl, getCorrelationId)
  const btcBackendApi = bitcoinBackendFactory.withCurrency(backendApiUrl, Currency.BTC, getCorrelationId)
  const btgBackendApi = bitcoinBackendFactory.withCurrency(backendApiUrl, Currency.BTG, getCorrelationId)
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
  balance(token: string, fiatCurrency: string): Promise<BalanceBackendResponse>
  createAuthToken(token: string, duration?: string, ip?: string, scope?: string[]): Promise<CreateAuthTokenBackendResponse>
  deleteAuthToken(token: string): Promise<DeleteAuthTokenBackendResponse>
}

export const create = (backendApiUrl: string, getCorrelationId: CorrelationIdGetter): CoreBackendApi => {
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
    const response = await requestWithCorrelationId(`${backendApiUrl}/user/login`, options, getCorrelationId())
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
    const response = await requestWithCorrelationId(`${backendApiUrl}/user/2fa/init`, options, getCorrelationId())
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
    const response = await requestWithCorrelationId(`${backendApiUrl}/user/2fa/confirm`, options, getCorrelationId())
    return response.data
  }

  const disable2fa = async (token: string, password: string, code: number): Promise<Disable2faBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      },
      body: JSON.stringify({ password, code })
    }
    const response = await requestWithCorrelationId(`${backendApiUrl}/user/2fa/disable`, options, getCorrelationId())
    return response.data
  }

  const register = async (login: string): Promise<RegisterBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        'X-Correlation-Id': getCorrelationId()
      },
      body: JSON.stringify({
        email: login
      })
    }

    const response = await requestWithCorrelationId(`${backendApiUrl}/user/register`, options, getCorrelationId())
    return response.data
  }

  const setupPassword = async (token: string, password: String): Promise<SetupPasswordBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      },
      body: JSON.stringify({
        password
      })
    }
    const response = await requestWithCorrelationId(`${backendApiUrl}/user/setup-password`, options, getCorrelationId())
    return response.data
  }

  const info = async (token: string): Promise<InfoBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      }
    }

    const response = await requestWithCorrelationId(`${backendApiUrl}/user/info`, options, getCorrelationId())
    return response.data
  }

  const monthlySummary = async (token: string, month: number, year: number, fiatCurrency: string): Promise<MontlySummaryBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      }
    }

    const response = await requestWithCorrelationId(`${backendApiUrl}/transfer/monthly-summary/${month}/${year}/${fiatCurrency}`, options, getCorrelationId())
    return response.data
  }

  const listTransfers = async (token: string,
                               limit: number,
                               nextPageToken?: string): Promise<ListTransfersBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      }
    }

    const queryParams = [
      { key: 'limit', value: limit },
      { key: 'nextPageToken', value: nextPageToken }
    ]
    const queryString = buildQueryParamString(queryParams)
    const response = await requestWithCorrelationId(`${backendApiUrl}/transfer${queryString}`, options, getCorrelationId())
    return response.data
  }

  const chainNetworkType = async (): Promise<ChainModeResponse> => {
    const options = {
      method: 'GET',
      headers: {
        'X-Correlation-Id': getCorrelationId()
      }
    }
    const response = await requestWithCorrelationId(`${backendApiUrl}/chain-network-type`, options, getCorrelationId())
    return response.data
  }

  const createAuthToken = async (token: string, duration?: string, ip?: string, scope?: string[]): Promise<CreateAuthTokenBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      },
      body: JSON.stringify({
        duration,
        ip,
        scope
      })
    }
    const response = await requestWithCorrelationId(`${backendApiUrl}/user/auth-token`, options, getCorrelationId())
    return response.data
  }

  const deleteAuthToken = async (token: string): Promise<DeleteAuthTokenBackendResponse> => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      }
    }
    const response = await requestWithCorrelationId(`${backendApiUrl}/user/auth-token`, options, getCorrelationId())
    return response.data
  }

  const balance = async (token: string, fiatCurrency: string): Promise<BalanceBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      }
    }
    const queryParams = [
      { key: 'fiatCurrency', value: fiatCurrency }
    ]
    const queryString = buildQueryParamString(queryParams)
    const response = await requestWithCorrelationId(`${backendApiUrl}/user/balance${queryString}`, options, getCorrelationId())
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
    chainNetworkType,
    balance,
    createAuthToken,
    deleteAuthToken
  }
}


export const currencyApi = (backendApiUrl: string, currency: Currency, getCorrelationId: CorrelationIdGetter) => {
  // wallet
  const createWallet = async <T>(
    token: string,
    params: CreateWalletBackendParams
  ): Promise<T> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      },
      body: JSON.stringify({
        ...params
      })
    }

    const response = await requestWithCorrelationId(`${backendApiUrl}/${currency}/wallet`, options, getCorrelationId())
    return response.data
  }

  const editWallet = async <T>(token: string, walletId: string, name: string): Promise<T> => {
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      },
      body: JSON.stringify({
        name: name
      })
    }

    const response = await requestWithCorrelationId(`${backendApiUrl}/${currency}/wallet/${walletId}`, options, getCorrelationId())
    return response.data
  }

  const getWallet = async (
    token: string,
    walletId: string
  ): Promise<GetWalletBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      }
    }

    const response = await requestWithCorrelationId(`${backendApiUrl}/${currency}/wallet/${walletId}`, options, getCorrelationId())
    return response.data
  }

  const listWallets = async (
    token: string,
    limit: number,
    searchPhrase?: string,
    nextPageToken?: string
  ): Promise<ListWalletsBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      }
    }

    const queryParams = [
      { key: 'limit', value: limit },
      { key: 'searchPhrase', value: searchPhrase },
      { key: 'nextPageToken', value: nextPageToken }
    ]
    const queryString = buildQueryParamString(queryParams)

    const response = await requestWithCorrelationId(`${backendApiUrl}/${currency}/wallet${queryString}`, options, getCorrelationId())
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
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      }
    }
    const queryParams = [
      { key: 'limit', value: limit },
      { key: 'nextPageToken', value: nextPageToken }
    ]
    const queryString = buildQueryParamString(queryParams)
    const response = await requestWithCorrelationId(`${backendApiUrl}/${currency}/wallet/${walletId}/webhooks${queryString}`, options, getCorrelationId())
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
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      }
    }
    const response = await requestWithCorrelationId(`${backendApiUrl}/${currency}/wallet/${walletId}/webhooks/${webhookId}`, options, getCorrelationId())
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
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      },
      body: JSON.stringify({ callbackUrl, settings })
    }
    const response = await requestWithCorrelationId(`${backendApiUrl}/${currency}/wallet/${walletId}/webhooks`, options, getCorrelationId())
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
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      }
    }
    const response = await requestWithCorrelationId(`${backendApiUrl}/${currency}/wallet/${walletId}/webhooks/${webhookId}`, options, getCorrelationId())
    return response.data
  }


  const getAddress = async <T>(token: string, walletId: string, address: string): Promise<T> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      }
    }

    const response = await requestWithCorrelationId(`${backendApiUrl}/${currency}/wallet/${walletId}/address/${address}`, options, getCorrelationId())
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
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      }
    }

    const queryParams = [
      { key: 'limit', value: limit },
      { key: 'nextPageToken', value: nextPageToken }
    ]
    const queryString = buildQueryParamString(queryParams)
    const response = await requestWithCorrelationId(`${backendApiUrl}/${currency}/wallet/${walletId}/address${queryString}`, options, getCorrelationId())
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
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      }
    }

    const queryString = buildQueryParamString([{ key: 'includePrivate', value: includePrivate }])
    const response = await requestWithCorrelationId(`${backendApiUrl}/${currency}/key/${keyId}${queryString}`, options, getCorrelationId())
    return response.data
  }

  const createPolicy = async (token: string, params: PolicyCreateRequest): Promise<any> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      },
      body: JSON.stringify(params)
    }

    const response = await requestWithCorrelationId(`${backendApiUrl}/${currency}/policy`, options, getCorrelationId())
    return response.data
  }

  const listPoliciesForWallet = async (token: string, walletId: string): Promise<ListPoliciesForWalletResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      }
    }

    const response = await requestWithCorrelationId(`${backendApiUrl}/${currency}/wallet/${walletId}/policy`, options, getCorrelationId())
    return response.data
  }

  const listTransfers = async (token: string, walletId: string, limit: number, nextPageToken?: string): Promise<ListTransfersBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      }
    }

    const queryParams = [
      { key: 'limit', value: limit },
      { key: 'nextPageToken', value: nextPageToken }
    ]
    const queryString = buildQueryParamString(queryParams)
    const response = await requestWithCorrelationId(`${backendApiUrl}/${currency}/wallet/${walletId}/transfer${queryString}`, options, getCorrelationId())
    return response.data
  }

  const findTransferByTxHash = async (token: string, walletId: string, txHash: string): Promise<TransferItemBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
        'X-Correlation-Id': getCorrelationId()
      }
    }
    const response = await requestWithCorrelationId(`${backendApiUrl}/${currency}/wallet/${walletId}/transfer/${txHash}`, options, getCorrelationId())
    return response.data
  }

  const listPolicies = async (token: string, limit: number, nextPageToken?: string): Promise<ListPoliciesResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }
    const queryParams = [
      { key: 'limit', value: limit },
      { key: 'nextPageToken', value: nextPageToken }
    ]
    const queryString = buildQueryParamString(queryParams)
    const response = await requestWithCorrelationId(`${backendApiUrl}/${currency}/policy${queryString}`, options, getCorrelationId())
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

    const response = await requestWithCorrelationId(`${backendApiUrl}/${currency}/policy/${policyId}/assign`, options, getCorrelationId())
    return response.data
  }

  const listWalletsForPolicy = async (token: string, policyId: string): Promise<ListWalletsForPolicyResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }
    const response = await requestWithCorrelationId(`${backendApiUrl}/${currency}/policy/${policyId}/wallet`, options, getCorrelationId())
    return response.data
  }

  return {
    createWallet,
    editWallet,
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
