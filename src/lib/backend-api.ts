import {
  DetailedWallet, UTXO
} from '../types/domain'
import {
  LoginBackendResponse,
  RegisterBackendResponse,
  InfoBackendResponse,
  CreateWalletBackendResponse,
  GetWalletBackendResponse,
  ListWalletsBackendResponse
} from '../types/backend-response'
import request from './utils/request'
import { BACKEND_API_PREFIX } from './constants'

const getUrlBase = () => `${process.env.BACKEND_API_URL}/${BACKEND_API_PREFIX}`

export const getWalletDetailed = (id: number): Promise<DetailedWallet> => {
  return Promise.resolve({
    id: 13,
    unspents: [],
    addresses: {
      change: [],
      receive: []
    },
    keychains: []
  })
}

export const getWalletUnspents = (token: string, id: string, amount: number): Promise<UTXO[]> => {
  return Promise.resolve([])
}

export const getWalletKeychains = (id: number) => {
  return Promise.resolve([{}])
}

export const getNewChangeAddress = (token: string, id: string): Promise<string> => {
  return Promise.resolve('')
}

// TODO: handle api errors
export const login = (login: string, password: string): Promise<LoginBackendResponse>  => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      password,
      email: login
    })
  }

  return request(`${getUrlBase()}/user/login`, options)
}

export const register = (login: string, password: string): Promise<RegisterBackendResponse> => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      password,
      email: login
    })
  }

  return request(`${getUrlBase()}/user/register`, options)
}

export const info = (token: string): Promise<InfoBackendResponse> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: token
    }
  }

  return request(`${getUrlBase()}/user/info`, options)
}

export const createWallet = (
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

  return request(`${getUrlBase()}/btc/wallet/create`, options)
}

export const getWallet = (token: string, id: string): Promise<GetWalletBackendResponse> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: token
    }
  }

  return request(`${getUrlBase()}/btc/wallet/${id}`, options)
}

export const listWallets = (
  token: string, limit: number, nextPageToken?: string
): Promise<ListWalletsBackendResponse> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: token
    }
  }

  const queryString = `limit=${limit}&${nextPageToken ? `nextPageToken=${nextPageToken}` : ''}`

  return request(`${getUrlBase()}/btc/wallet?${queryString}`, options)
}

export const sendTransaction = (token: string, transactionHex: string): Promise<boolean> => {
  return Promise.resolve(true)
}
