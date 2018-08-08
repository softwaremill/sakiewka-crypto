import {
  UTXO
} from '../types/domain'
import {
  LoginBackendResponse,
  RegisterBackendResponse,
  InfoBackendResponse,
  CreateWalletBackendResponse,
  GetWalletBackendResponse,
  ListWalletsBackendResponse,
  EthGetTransactionParamsResponse
} from '../types/backend-response'
import request from './utils/request'
import { BACKEND_API_PREFIX } from './constants'

const getUrlBase = () => `${process.env.BACKEND_API_URL}/${BACKEND_API_PREFIX}`

export const getWalletUnspents = (token: string, id: string, amount: number): Promise<UTXO[]> => {
  return Promise.resolve([])
}

export const getNewChangeAddress = (token: string, id: string): Promise<string> => {
  return Promise.resolve('')
}

// TODO: handle api errors
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

export const createWallet = async (
  token: string,
  params: object): Promise<CreateWalletBackendResponse> => {
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

export const getWallet = async (token: string, id: string): Promise<GetWalletBackendResponse> => {
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
  token: string, limit: number, nextPageToken?: string
): Promise<ListWalletsBackendResponse> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: token
    }
  }

  const queryString = `limit=${limit}&${nextPageToken ? `nextPageToken=${nextPageToken}` : ''}`

  const response = await request(`${getUrlBase()}/btc/wallet?${queryString}`, options)
  return response.data
}

export const sendTransaction = (token: string, transactionHex: string): Promise<boolean> => {
  return Promise.resolve(true)
}

export const ethGetTransactionParams = (
  address: string
): Promise<EthGetTransactionParamsResponse> => {
  return Promise.resolve({
    gasLimit: '123',
    gasPrice: '123',
    nonce: 10,
    contractNonce: 2
  })
}

export const ethSendTransaction = (signature: string) => {
  return Promise.resolve({})
}
