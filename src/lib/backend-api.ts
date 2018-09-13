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
  CreateNewAddressBackendResponse,
  EthGetTransactionParamsResponse,
  EthSendTransactionResponse
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
  id: string
): Promise<GetWalletBackendResponse> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: token
    }
  }

  const response = await request(`${getUrlBase()}/btc/wallet/${id}`, options)
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

export const createNewAddress = async (token: string, id: string, name?: string): Promise<CreateNewAddressBackendResponse> => {
  const options = {
    method: 'POST',
    headers: {
      Authorization: token
    },
    body: JSON.stringify(removeUndefinedFromObject({
      name
    }))
  }

  const response = await request(`${getUrlBase()}/btc/wallet/${id}/address`, options)
  return response.data
}

export const getWalletUnspents = (token: string, id: string, amount: number): Promise<UTXO[]> => {
  return Promise.resolve([])
}

// transaction
export const sendTransaction = (token: string, transactionHex: string): Promise<boolean> => {
  return Promise.resolve(true)
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
