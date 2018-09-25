import {
  UTXO
} from '../types/domain'
import {
  LoginBackendResponse,
  RegisterBackendResponse,
  InfoBackendResponse,
  CreateWalletBackendResponse,
  CreateWalletBackendParams,
  GetWalletBackendResponse,
  ListWalletsBackendResponse,
  GetWalletBalanceBackendResponse,
  CreateNewAddressBackendResponse,
  GetAddressBackendResponse,
  ListAddressesBackendResponse,
  ListUnspentsBackendResponse,
  EthGetTransactionParamsResponse,
  EthSendTransactionResponse,
  GetKeyBackendResponse
} from 'backend-api'
import request from './utils/request'
import { BACKEND_API_PREFIX } from './constants'
import { removeUndefinedFromObject } from './utils/helpers'

// TODO: handle api errors

const getUrlBase = () => `${process.env.BACKEND_API_URL}/${BACKEND_API_PREFIX}`

// BTC
// user
export const login = async (login: string, password: string): Promise<LoginBackendResponse>  => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      password,
      email: login
    })
  }

  const response = await request(`${getUrlBase()}/user/login`, options)
  return response.data
}

export const register = async (login: string, password: string): Promise<RegisterBackendResponse> => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      password,
      email: login
    })
  }

  const response = await request(`${getUrlBase()}/user/register`, options)
  return response.data
}

export const info = async (token: string): Promise<InfoBackendResponse> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: token
    }
  }

  const response = await request(`${getUrlBase()}/user/info`, options)
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

  const response = await request(`${getUrlBase()}/btc/wallet`, options)
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

  const response = await request(`${getUrlBase()}/btc/wallet/${walletId}`, options)
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

  const response = await request(`${getUrlBase()}/btc/wallet?${queryString}`, options)
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

  const response = await request(`${getUrlBase()}/btc/wallet/${walletId}/balance`, options)
  return response.data
}

export const createNewAddress = async (token: string, walletId: string, name?: string): Promise<CreateNewAddressBackendResponse> => {
  const options = {
    method: 'POST',
    headers: {
      Authorization: token
    },
    body: JSON.stringify(removeUndefinedFromObject({
      name
    }))
  }

  const response = await request(`${getUrlBase()}/btc/wallet/${walletId}/address`, options)
  return response.data
}

export const getAddress = async (token: string, walletId: string, address: string): Promise<GetAddressBackendResponse> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: token
    }
  }

  const response = await request(`${getUrlBase()}/btc/wallet/${walletId}/address/${address}`, options)
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

  const response = await request(`${getUrlBase()}/btc/wallet/${walletId}/address?${queryString}`, options)
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

  const response = await request(`${getUrlBase()}/btc/wallet/${walletId}/utxo?amountBtc=${amount}&feeRateSatoshi=${feeRate}`, options)
  return response.data
}

// transaction
export const sendTransaction = (token: string, transactionHex: string): Promise<boolean> => {
  return Promise.resolve(true)
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

  const response = await request(`${getUrlBase()}/btc/key/${keyId}${includePrivate ? `?includePrivate=${includePrivate}` : ''}`, options)
  return response.data
}

// ETH
// transaction
export const ethGetTransactionParams = (
  userToken: string
): Promise<EthGetTransactionParamsResponse> => {
  return Promise.resolve({
    gasLimit: '123',
    gasPrice: '123',
    nonce: 10,
    contractNonce: 2
  })
}

export const ethSendTransaction = (
  userToken: string, signature: string, operationHash: string
): Promise<EthSendTransactionResponse> => {
  return Promise.resolve({})
}
