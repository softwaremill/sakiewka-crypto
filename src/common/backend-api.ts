import {
  Keychain,
  Wallet,
  DetailedWallet
} from '../types/domain'
import {
  LoginBackendResponse,
  RegisterBackendResponse
} from '../types/backend-response'
import request from './utils/request'
import { BACKEND_API_PREFIX } from './constants'

const getUrlBase = () => `${process.env.BACKEND_API_URL}/${BACKEND_API_PREFIX}`

export const createWallet = (publicKeys: Keychain[]) => {
  return Promise.resolve()
}

export const getWallet = (id: number) => {
  return Promise.resolve()
}

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

export const getWalletUnspents = (id: number) => {
  return Promise.resolve([{}])
}

export const getWalletKeychains = (id: number) => {
  return Promise.resolve([{}])
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

export const info = (token: string): Promise<RegisterBackendResponse> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: token
    }
  }

  return request(`${getUrlBase()}/user/info`, options)
}
