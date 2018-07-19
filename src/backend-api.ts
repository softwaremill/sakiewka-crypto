import { Keychain, Wallet, DetailedWallet } from './domain'

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
