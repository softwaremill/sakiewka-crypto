import {
  CreateNewAddressBackendResponse,
  CreateWalletBackendParams,
  CreateWalletBackendResponse,
  GetAddressBackendResponse,
  GetKeyBackendResponse,
  GetWalletBackendResponse,
  GetWalletBalanceBackendResponse,
  InfoBackendResponse,
  ListAddressesBackendResponse,
  ListUnspentsBackendResponse,
  ListWalletsBackendResponse,
  LoginBackendResponse,
  RegisterBackendResponse
} from 'response'
import request from './utils/request'
import { removeUndefinedFromObject } from './utils/helpers'
import { hashPassword } from './crypto';

const getBackendApiUrl = () => process.env.BACKEND_API_URL

// BTC
// user
export const login = async (login: string, password: string): Promise<LoginBackendResponse> => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      password: hashPassword(password),
      email: login
    })
  }

  const response = await request(`${getBackendApiUrl()}/user/login`, options)
  return response.data
}

export const register = async (login: string, password: string): Promise<RegisterBackendResponse> => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      password: hashPassword(password),
      email: login
    })
  }

  const response = await request(`${getBackendApiUrl()}/user/register`, options)
  return response.data
}

export const info = async (token: string): Promise<InfoBackendResponse> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: token
    }
  }

  const response = await request(`${getBackendApiUrl()}/user/info`, options)
  return response.data
}

// wallet
export const createWallet = async (
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

  const response = await request(`${getBackendApiUrl()}/btc/wallet`, options)
  return response.data
}

export const getWallet = async (
    token: string,
    walletId: string
): Promise<GetWalletBackendResponse> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: token
    }
  }

  const response = await request(`${getBackendApiUrl()}/btc/wallet/${walletId}`, options)
  return response.data
}

export const listWallets = async (
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

  const response = await request(`${getBackendApiUrl()}/btc/wallet?${queryString}`, options)
  return response.data
}

export const getWalletBalance = async (
    token: string,
    walletId: string
): Promise<GetWalletBalanceBackendResponse> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: token
    }
  }

  const response = await request(`${getBackendApiUrl()}/btc/wallet/${walletId}/balance`, options)
  return response.data
}

export const createNewAddress = async (
    token: string, walletId: string, change: boolean = false, name?: string
): Promise<CreateNewAddressBackendResponse> => {
  const options = {
    method: 'POST',
    headers: {
      Authorization: token
    },
    body: JSON.stringify(removeUndefinedFromObject({
      name
    }))
  }

  const response = await request(`${getBackendApiUrl()}/btc/wallet/${walletId}/address?change=${change}`, options)
  return response.data
}

export const getServiceAddress = async (): Promise<any> => {
  return Promise.resolve(process.env.SERVICE_ADDRESS)
}

export const getAddress = async (token: string, walletId: string, address: string): Promise<GetAddressBackendResponse> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: token
    }
  }

  const response = await request(`${getBackendApiUrl()}/btc/wallet/${walletId}/address/${address}`, options)
  return response.data
}

export const listAddresses = async (
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

  const response = await request(`${getBackendApiUrl()}/btc/wallet/${walletId}/address?${queryString}`, options)
  return response.data
}

export const listUnspents = async (
    token: string, walletId: string, amount: number, feeRate?: number
): Promise<ListUnspentsBackendResponse> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: token
    }
  }

  const response = await request(`${getBackendApiUrl()}/btc/wallet/${walletId}/utxo?amountBtc=${amount}&feeRateSatoshi=${feeRate}`, options)
  return response.data
}

// transaction
export const sendTransaction = async (token: string, walletId: string, txHex: string): Promise<boolean> => {
  const options = {
    method: 'POST',
    headers: {
      Authorization: token
    },
    body: JSON.stringify({
      txHex
    })
  }

  const response = await request(`${getBackendApiUrl()}/btc/wallet/${walletId}/send`, options)
  return response.data
}

export const getKey = async (
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

  const response = await request(`${getBackendApiUrl()}/btc/key/${keyId}${includePrivate ? `?includePrivate=${includePrivate}` : ''}`, options)
  return response.data
}
