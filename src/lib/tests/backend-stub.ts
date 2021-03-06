import { KeyPair, KeyType } from '../../types/domain/key'
import { GetKeyBackendResponse } from '../../types/api/key'
import { BitcoinBackendApi } from '../bitcoin/bitcoin-backend-api'

export const stubGetWallet = (
  backendApi: BitcoinBackendApi,
  userKeyPair: KeyPair,
  backupKeyPair: KeyPair,
  serviceKeyPair: KeyPair,
) => {
  // @ts-ignore
  backendApi.getWallet = jest.fn(() => {
    return Promise.resolve({
      keys: [
        { pubKey: userKeyPair.pubKey, type: KeyType.USER },
        { pubKey: backupKeyPair.pubKey, type: KeyType.BACKUP },
        { pubKey: serviceKeyPair.pubKey, type: KeyType.SERVICE },
      ],
    })
  })
}

export const stubUnspents = (backendApi: BitcoinBackendApi, unspents: any) => {
  // @ts-ignore
  const getUnspentsMock = jest.fn(() => {
    return Promise.resolve(unspents)
  })
  // @ts-ignore
  backendApi.listUnspents = getUnspentsMock
  return getUnspentsMock
}

export const stubSendTx = (backendApi: BitcoinBackendApi) => {
  // @ts-ignore
  const sendTxMock = jest.fn(() => {
    return Promise.resolve(true)
  })
  // @ts-ignore
  backendApi.sendTransaction = sendTxMock
  return sendTxMock
}

export const createPath = (
  cosigner: number,
  change: number,
  address: number,
) => {
  return {
    cosignerIndex: cosigner,
    change,
    addressIndex: address,
  }
}

export const stubCreateAddress = (
  backendApi: BitcoinBackendApi,
  address: string,
) => {
  // @ts-ignore
  backendApi.createNewAddress = jest.fn(() => {
    return Promise.resolve({
      address,
    })
  })
}

export const stubFeeRates = (
  backendApi: BitcoinBackendApi,
  recommended: number,
) => {
  // @ts-ignore
  backendApi.getFeeRates = jest.fn(() => {
    return Promise.resolve({ recommended })
  })
}

export const stubGetKey = (
  backendApi: BitcoinBackendApi,
  response: GetKeyBackendResponse,
) => {
  // @ts-ignore
  backendApi.getKey = jest.fn(() => response)
}
