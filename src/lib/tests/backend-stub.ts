import * as backendApiFactory from '../backend-api'
import { KeyPair, KeyType } from '../../types/domain';
import { GetKeyBackendResponse } from 'response';
import { currency } from './helpers'

export const stubGetWallet = (userKeyPair: KeyPair, backupKeyPair: KeyPair, serviceKeyPair: KeyPair) => {
  const backendApi = backendApiFactory.withCurrency("http://backendApiUrl", currency)
  // @ts-ignore
  backendApi.getWallet = jest.fn(() => {
    return Promise.resolve({
      keys: [
        { pubKey: userKeyPair.pubKey, type: KeyType.USER },
        { pubKey: backupKeyPair.pubKey, type: KeyType.BACKUP },
        { pubKey: serviceKeyPair.pubKey, type: KeyType.SERVICE }
      ]
    })
  })
  // @ts-ignore
  backendApiFactory.withCurrency = (currency) => backendApi
}

export const stubUnspents = (unspents: any) => {
  const backendApi = backendApiFactory.withCurrency("http://backendApiUrl", currency)
  // @ts-ignore
  backendApi.listUnspents = jest.fn(() => {
    return Promise.resolve(unspents)
  })
  // @ts-ignore
  backendApiFactory.withCurrency = (currency) => backendApi
}

export const stubSendTx = () => {
  const backendApi = backendApiFactory.withCurrency("http://backendApiUrl", currency)
  // @ts-ignore
  const sendTxMock = jest.fn(() => {
    return Promise.resolve(true)
  })
  // @ts-ignore
  backendApi.sendTransaction = sendTxMock
  // @ts-ignore
  backendApiFactory.withCurrency = (currency) => backendApi
  return sendTxMock
}

export const createPath = (cosigner: number, change: number, address: number) => {
  return {
    cosignerIndex: cosigner,
    change: change,
    addressIndex: address
  }
}

export const stubCreateAddress = (address: string) => {
  const backendApi = backendApiFactory.withCurrency("http://backendApiUrl", currency)
  // @ts-ignore
  backendApi.createNewAddress = jest.fn(() => {
    return Promise.resolve({
      address: address
    })
  })
  // @ts-ignore
  backendApiFactory.withCurrency = (currency) => backendApi
}

export const stubFeesRates = (recommended: number) => {
  const backendApi = backendApiFactory.withCurrency("http://backendApiUrl", currency)
  // @ts-ignore
  backendApi.getFeesRates = jest.fn(() => {
    return Promise.resolve({ recommended: recommended })
  })
  // @ts-ignore
  backendApiFactory.withCurrency = (currency) => backendApi
}

export const stubGetKey = (response: GetKeyBackendResponse) => {
  const backendApi = backendApiFactory.withCurrency("http://backendApiUrl", currency)

  // @ts-ignore
  const mockImplementation = jest.fn(() => response)
  // @ts-ignore
  backendApi.getKey = mockImplementation
  // @ts-ignore
  backendApiFactory.withCurrency = (currency) => backendApi
}