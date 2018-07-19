import { Keychain, Wallet, DetailedWallet } from './domain'
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

export const login = (login: string, password: string) => {
  return Promise.resolve({ token: 'abc' })
}

export const register = (login: string, password: string) => {
  // robię requesta do backendu
  const options = {
    method: 'POST',
    body: JSON.stringify({
      password,
      email: login
    })
  }

  return request(`${getUrlBase()}/user/register`, options)
}
