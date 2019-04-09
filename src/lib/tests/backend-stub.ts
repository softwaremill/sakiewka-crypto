import { KeyPair, KeyType } from '../../types/domain';
import { GetKeyBackendResponse } from 'response';
import { CurrencyBackendApi } from '../backend-api';

export const stubGetWallet = (backendApi: CurrencyBackendApi, userKeyPair: KeyPair, backupKeyPair: KeyPair, serviceKeyPair: KeyPair) => {
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
}

export const stubUnspents = (backendApi: CurrencyBackendApi, unspents: any) => {
  // @ts-ignore
  backendApi.listUnspents = jest.fn(() => {
    return Promise.resolve(unspents)
  })
}

export const stubSendTx = (backendApi: CurrencyBackendApi) => {
  // @ts-ignore
  const sendTxMock = jest.fn(() => {
    return Promise.resolve(true)
  })
  // @ts-ignore
  backendApi.sendTransaction = sendTxMock
  return sendTxMock
}

export const createPath = (cosigner: number, change: number, address: number) => {
  return {
    cosignerIndex: cosigner,
    change: change,
    addressIndex: address
  }
}

export const stubCreateAddress = (backendApi: CurrencyBackendApi, address: string) => {
  // @ts-ignore
  backendApi.createNewAddress = jest.fn(() => {
    return Promise.resolve({
      address: address
    })
  })
}

export const stubFeesRates = (backendApi: CurrencyBackendApi, recommended: number) => {
  // @ts-ignore
  backendApi.getFeesRates = jest.fn(() => {
    return Promise.resolve({ recommended: recommended })
  })
}

export const stubGetKey = (backendApi: CurrencyBackendApi, response: GetKeyBackendResponse) => {
  // @ts-ignore
  backendApi.getKey = jest.fn(() => response)
}