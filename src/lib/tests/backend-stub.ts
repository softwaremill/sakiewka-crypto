import * as backendApi from '../backend-api'
import { KeyPair, KeyType } from '../../types/domain';
import { GetKeyBackendResponse } from 'response';
import * as keyModule from '../key'

export const stubGetWallet = (userKeyPair: KeyPair, backupKeyPair: KeyPair, serviceKeyPair: KeyPair) => {
    // @ts-ignore
    backendApi.getWallet = jest.fn(() => {
        return Promise.resolve({
            keys: [
                { pubKey: userKeyPair.pubKey, type: KeyType.user },
                { pubKey: backupKeyPair.pubKey, type: KeyType.backup },
                { pubKey: serviceKeyPair.pubKey, type: KeyType.service }
            ]
        })
    })
}

export const stubUnspents = (unspents: any) => {
    // @ts-ignore
    backendApi.listUnspents = jest.fn(() => {
        return Promise.resolve(unspents)
    })
}

export const stubSendTx = () => {
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

export const stubCreateAddress = (address: string) => {
    // @ts-ignore
    backendApi.createNewAddress = jest.fn(() => {
        return Promise.resolve({
            address: address
        })
    })
}

export const stubFeesRates = (recommended: number) => {
    // @ts-ignore
    backendApi.getFeesRates = jest.fn(() => {
        return Promise.resolve({ recommended: recommended })
    })
}

export const stubGetKey = (response: GetKeyBackendResponse) => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => response)
    // @ts-ignore
    keyModule.getKey = mockImplementation
}