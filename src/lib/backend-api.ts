import {
  ListPoliciesForWalletBackendResponse,
  ListPoliciesBackendResponse,
  AssignPolicyBackendParams,
  AssignPolicyBackendResponse,
  ListWalletsForPolicyBackendResponse,
  CreatePolicyBackendParams,
  CreatePolicyBackendResponse,
} from '../types/api/policy'
import { ChainNetworkTypeBackendResponse } from '../types/api/chain'
import {
  ListTransfersBackendResponse,
  MonthlySummaryBackendResponse,
} from './../types/api/transfer'
import {
  CreateWebhookBackendResponse,
  DeleteWebhookBackendResponse,
  GetWebhookBackendResponse,
  ListWebhooksBackendResponse,
} from '../types/api/webhook'
import { GetKeyBackendResponse } from '../types/api/key'
import {
  InfoBackendResponse,
  LoginBackendResponse,
  RegisterBackendResponse,
  SetupPasswordBackendResponse,
  Confirm2faBackendResponse,
  Disable2faBackendResponse,
  Init2faBackendResponse,
  BalanceBackendResponse,
  CreateAuthTokenBackendResponse,
  DeleteAuthTokenBackendResponse,
} from '../types/api/user'
import {
  CreateWalletBackendParams,
  GetWalletBackendResponse,
  ListWalletsBackendResponse,
} from '../types/api/wallet'
import {
  buildQueryParamString,
  createHttpClient,
  HttpClient,
} from './utils/httpClient'
import { Currency } from '..'
import * as bitcoinBackendFactory from './bitcoin/bitcoin-backend-api'
import * as eosBackendFactory from './eos/eos-backend-api'

export interface SakiewkaBackend {
  core: CoreBackendApi
  [Currency.BTC]: bitcoinBackendFactory.BitcoinBackendApi
  [Currency.BTG]: bitcoinBackendFactory.BitcoinBackendApi
  [Currency.EOS]: eosBackendFactory.EosBackendApi
}

export type CorrelationIdGetter = () => string

export const backendFactory = (
  backendApiUrl: string,
  getCorrelationId: CorrelationIdGetter,
): SakiewkaBackend => {
  const httpClient = createHttpClient(getCorrelationId)
  const backendApi = create(backendApiUrl, httpClient)
  const btcBackendApi = bitcoinBackendFactory.withCurrency(
    backendApiUrl,
    Currency.BTC,
    httpClient,
  )
  const btgBackendApi = bitcoinBackendFactory.withCurrency(
    backendApiUrl,
    Currency.BTG,
    httpClient,
  )
  const eosBackendApi = eosBackendFactory.eosBackendApiFactory(
    backendApiUrl,
    httpClient,
  )

  return {
    core: backendApi,
    [Currency.BTC]: btcBackendApi,
    [Currency.BTG]: btgBackendApi,
    [Currency.EOS]: eosBackendApi,
  }
}

export interface CoreBackendApi {
  login(
    login: string,
    password: string,
    codeIn?: number,
  ): Promise<LoginBackendResponse>
  init2fa(token: string, password: string): Promise<Init2faBackendResponse>
  confirm2fa(
    token: string,
    password: string,
    code: number,
  ): Promise<Confirm2faBackendResponse>
  disable2fa(
    token: string,
    password: string,
    code: number,
  ): Promise<Disable2faBackendResponse>
  register(login: string): Promise<RegisterBackendResponse>
  setupPassword(
    token: string,
    password: String,
  ): Promise<SetupPasswordBackendResponse>
  info(token: string): Promise<InfoBackendResponse>
  monthlySummary(
    token: string,
    month: number,
    year: number,
    fiatCurrency: string,
  ): Promise<MonthlySummaryBackendResponse>
  listTransfers(
    token: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListTransfersBackendResponse>
  chainNetworkType(): Promise<ChainNetworkTypeBackendResponse>
  balance(token: string, fiatCurrency: string): Promise<BalanceBackendResponse>
  createAuthToken(
    token: string,
    duration?: string,
    ip?: string,
    scope?: string[],
  ): Promise<CreateAuthTokenBackendResponse>
  deleteAuthToken(token: string): Promise<DeleteAuthTokenBackendResponse>
  addUserSupportSubmission(
    token: string,
    subject: string,
    content: string,
  ): Promise<any>
}

export const create = (
  backendApiUrl: string,
  httpClient: HttpClient,
): CoreBackendApi => {
  // BTC
  // user
  const login = async (
    login: string,
    password: string,
    codeIn?: number,
  ): Promise<LoginBackendResponse> => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        password,
        email: login,
        code: codeIn,
      }),
    }
    const response = await httpClient.request(
      `${backendApiUrl}/user/login`,
      options,
    )
    return response.data
  }

  const init2fa = async (
    token: string,
    password: string,
  ): Promise<Init2faBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify({ password }),
    }
    const response = await httpClient.request(
      `${backendApiUrl}/user/2fa/init`,
      options,
    )
    return response.data
  }

  const confirm2fa = async (
    token: string,
    password: string,
    code: number,
  ): Promise<Confirm2faBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify({ password, code }),
    }
    const response = await httpClient.request(
      `${backendApiUrl}/user/2fa/confirm`,
      options,
    )
    return response.data
  }

  const disable2fa = async (
    token: string,
    password: string,
    code: number,
  ): Promise<Disable2faBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify({ password, code }),
    }
    const response = await httpClient.request(
      `${backendApiUrl}/user/2fa/disable`,
      options,
    )
    return response.data
  }

  const register = async (login: string): Promise<RegisterBackendResponse> => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        email: login,
      }),
    }

    const response = await httpClient.request(
      `${backendApiUrl}/user/register`,
      options,
    )
    return response.data
  }

  const setupPassword = async (
    token: string,
    password: String,
  ): Promise<SetupPasswordBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify({
        password,
      }),
    }
    const response = await httpClient.request(
      `${backendApiUrl}/user/setup-password`,
      options,
    )
    return response.data
  }

  const info = async (token: string): Promise<InfoBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }

    const response = await httpClient.request(
      `${backendApiUrl}/user/info`,
      options,
    )
    return response.data
  }

  const monthlySummary = async (
    token: string,
    month: number,
    year: number,
    fiatCurrency: string,
  ): Promise<MonthlySummaryBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }

    const response = await httpClient.request(
      `${backendApiUrl}/transfer/monthly-summary/${month}/${year}/${fiatCurrency}`,
      options,
    )
    return response.data
  }

  const listTransfers = async (
    token: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListTransfersBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }

    const queryParams = [
      { key: 'limit', value: limit },
      { key: 'nextPageToken', value: nextPageToken },
    ]
    const queryString = buildQueryParamString(queryParams)
    const response = await httpClient.request(
      `${backendApiUrl}/transfer${queryString}`,
      options,
    )
    return response.data
  }

  const chainNetworkType = async (): Promise<
    ChainNetworkTypeBackendResponse
  > => {
    const options = {
      method: 'GET',
    }
    const response = await httpClient.request(
      `${backendApiUrl}/chain-network-type`,
      options,
    )
    return response.data
  }

  const createAuthToken = async (
    token: string,
    duration?: string,
    ip?: string,
    scope?: string[],
  ): Promise<CreateAuthTokenBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify({
        duration,
        ip,
        scope,
      }),
    }
    const response = await httpClient.request(
      `${backendApiUrl}/user/auth-token`,
      options,
    )
    return response.data
  }

  const deleteAuthToken = async (
    token: string,
  ): Promise<DeleteAuthTokenBackendResponse> => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    }
    const response = await httpClient.request(
      `${backendApiUrl}/user/auth-token`,
      options,
    )
    return response.data
  }

  const balance = async (
    token: string,
    fiatCurrency: string,
  ): Promise<BalanceBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }
    const queryParams = [{ key: 'fiatCurrency', value: fiatCurrency }]
    const queryString = buildQueryParamString(queryParams)
    const response = await httpClient.request(
      `${backendApiUrl}/user/balance${queryString}`,
      options,
    )
    return response.data
  }

  const addUserSupportSubmission = async (
    token: string,
    subject: string,
    content: string,
  ): Promise<any> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify({
        subject,
        content,
      }),
    }
    return await httpClient.request(`${backendApiUrl}/user/support`, options)
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
    deleteAuthToken,
    addUserSupportSubmission,
  }
}

interface BackendCurrencyApi {
  createWallet<T>(
    userToken: string,
    params: CreateWalletBackendParams,
  ): Promise<T>
  editWallet<T>(
    userToken: string,
    walletId: string,
    newName: string,
  ): Promise<T>
  getWallet(token: string, walletId: string): Promise<GetWalletBackendResponse>
  listWallets(
    token: string,
    limit: number,
    searchPhrase?: string,
    nextPageToken?: string,
  ): Promise<ListWalletsBackendResponse>
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
  createWebhook(
    token: string,
    walletId: string,
    callbackUrl: string,
    settings: Object,
  ): Promise<CreateWebhookBackendResponse>
  deleteWebhook(
    token: string,
    walletId: string,
    webhookId: string,
  ): Promise<DeleteWebhookBackendResponse>
  getAddress<T>(token: string, walletId: string, address: string): Promise<T>
  listAddresses<T>(
    token: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<T>
  getKey(
    token: string,
    keyId: string,
    includePrivate?: boolean,
  ): Promise<GetKeyBackendResponse>
  createPolicy(
    token: string,
    params: CreatePolicyBackendParams,
  ): Promise<CreatePolicyBackendResponse>
  listPoliciesForWallet(
    token: string,
    walletId: string,
  ): Promise<ListPoliciesForWalletBackendResponse>
  listTransfers<T>(
    token: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<T>
  findTransferByTxHash<T>(
    token: string,
    walletId: string,
    txHash: string,
  ): Promise<T>
  listPolicies(
    token: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListPoliciesBackendResponse>
  assignPolicy(
    token: string,
    policyId: string,
    assignParams: AssignPolicyBackendParams,
  ): Promise<AssignPolicyBackendResponse>
  listWalletsForPolicy(
    token: string,
    policyId: string,
  ): Promise<ListWalletsForPolicyBackendResponse>
}

export const currencyApi = (
  backendApiUrl: string,
  currency: Currency,
  httpClient: HttpClient,
): BackendCurrencyApi => {
  // wallet
  const createWallet = async <T>(
    token: string,
    params: CreateWalletBackendParams,
  ): Promise<T> => {
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
      `${backendApiUrl}/${currency}/wallet`,
      options,
    )
    return response.data
  }

  const editWallet = async <T>(
    token: string,
    walletId: string,
    name: string,
  ): Promise<T> => {
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify({
        name,
      }),
    }

    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/wallet/${walletId}`,
      options,
    )
    return response.data
  }

  const getWallet = async (
    token: string,
    walletId: string,
  ): Promise<GetWalletBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }

    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/wallet/${walletId}`,
      options,
    )
    return response.data
  }

  const listWallets = async (
    token: string,
    limit: number,
    searchPhrase?: string,
    nextPageToken?: string,
  ): Promise<ListWalletsBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }

    const queryParams = [
      { key: 'limit', value: limit },
      { key: 'searchPhrase', value: searchPhrase },
      { key: 'nextPageToken', value: nextPageToken },
    ]
    const queryString = buildQueryParamString(queryParams)

    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/wallet${queryString}`,
      options,
    )
    return response.data
  }

  const listWebhooks = async (
    token: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListWebhooksBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }
    const queryParams = [
      { key: 'limit', value: limit },
      { key: 'nextPageToken', value: nextPageToken },
    ]
    const queryString = buildQueryParamString(queryParams)
    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/wallet/${walletId}/webhooks${queryString}`,
      options,
    )
    return response.data
  }

  const getWebhook = async (
    token: string,
    walletId: string,
    webhookId: string,
  ): Promise<GetWebhookBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }
    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/wallet/${walletId}/webhooks/${webhookId}`,
      options,
    )
    return response.data
  }

  const createWebhook = async (
    token: string,
    walletId: string,
    callbackUrl: string,
    settings: Object,
  ): Promise<CreateWebhookBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify({ callbackUrl, settings }),
    }
    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/wallet/${walletId}/webhooks`,
      options,
    )
    return response.data
  }

  const deleteWebhook = async (
    token: string,
    walletId: string,
    webhookId: string,
  ): Promise<DeleteWebhookBackendResponse> => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    }
    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/wallet/${walletId}/webhooks/${webhookId}`,
      options,
    )
    return response.data
  }

  const getAddress = async <T>(
    token: string,
    walletId: string,
    address: string,
  ): Promise<T> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }

    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/wallet/${walletId}/address/${address}`,
      options,
    )
    return response.data
  }

  const listAddresses = async <T>(
    token: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<T> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }

    const queryParams = [
      { key: 'limit', value: limit },
      { key: 'nextPageToken', value: nextPageToken },
    ]
    const queryString = buildQueryParamString(queryParams)
    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/wallet/${walletId}/address${queryString}`,
      options,
    )
    return response.data
  }

  const getKey = async (
    token: string,
    keyId: string,
    includePrivate?: boolean,
  ): Promise<GetKeyBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }

    const queryString = buildQueryParamString([
      { key: 'includePrivate', value: includePrivate },
    ])
    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/key/${keyId}${queryString}`,
      options,
    )
    return response.data
  }

  const createPolicy = async (
    token: string,
    params: CreatePolicyBackendParams,
  ): Promise<CreatePolicyBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(params),
    }

    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/policy`,
      options,
    )
    return response.data
  }

  const listPoliciesForWallet = async (
    token: string,
    walletId: string,
  ): Promise<ListPoliciesForWalletBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }

    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/wallet/${walletId}/policy`,
      options,
    )
    return response.data
  }

  const listTransfers = async <T>(
    token: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<T> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }

    const queryParams = [
      { key: 'limit', value: limit },
      { key: 'nextPageToken', value: nextPageToken },
    ]
    const queryString = buildQueryParamString(queryParams)
    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/wallet/${walletId}/transfer${queryString}`,
      options,
    )
    return response.data
  }

  const findTransferByTxHash = async <T>(
    token: string,
    walletId: string,
    txHash: string,
  ): Promise<T> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }
    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/wallet/${walletId}/transfer/${txHash}`,
      options,
    )
    return response.data
  }

  const listPolicies = async (
    token: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListPoliciesBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }
    const queryParams = [
      { key: 'limit', value: limit },
      { key: 'nextPageToken', value: nextPageToken },
    ]
    const queryString = buildQueryParamString(queryParams)
    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/policy${queryString}`,
      options,
    )
    return response.data
  }

  const assignPolicy = async (
    token: string,
    policyId: string,
    assignParams: AssignPolicyBackendParams,
  ): Promise<AssignPolicyBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(assignParams),
    }

    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/policy/${policyId}/assign`,
      options,
    )
    return response.data
  }

  const listWalletsForPolicy = async (
    token: string,
    policyId: string,
  ): Promise<ListWalletsForPolicyBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    }
    const response = await httpClient.request(
      `${backendApiUrl}/${currency}/policy/${policyId}/wallet`,
      options,
    )
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
    listWalletsForPolicy,
  }
}
