import { expect } from 'chai'

import * as backendApiFactory from '../../bitcoin/bitcoin-backend-api'
import { chainTransfersApiFactory } from '../../transfers';
import { currency } from '../helpers';

const backendApi = backendApiFactory.withCurrency("http://backendApiUrl", currency, () => '')
const chainTransfersApi = chainTransfersApiFactory(backendApi)

beforeEach(() => {
    // @ts-ignore
    backendApi.listTransfers = jest.fn(() => 'backend response')
    // @ts-ignore
    backendApi.findTransferByTxHash = jest.fn(() => 'backend response')
})

describe('chain transfers - listTransfers', () => {
  it('should exist', () => {
    expect(chainTransfersApi.listTransfers).to.be.a('function')
  })

  it('should pass proper arguments to backend',async () => {
    const result = await chainTransfersApi.listTransfers('testToken', '123', 50)

    expect(result).to.be.eq('backend response')
    // @ts-ignore
    const [token, walletId, limit, nextPageToken] = backendApi.listTransfers.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('123')
    expect(limit).to.eq(50)
    expect(nextPageToken).to.be.undefined
  })

  it('should pass nextPageToken to backend',async () => {
    const result = await chainTransfersApi.listTransfers('testToken', '123', 50, 'npt')

    expect(result).to.be.eq('backend response')
    // @ts-ignore
    const [token, walletId, limit, nextPageToken] = backendApi.listTransfers.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('123')
    expect(limit).to.eq(50)
    expect(nextPageToken).to.eq('npt')
  })
})

describe('transfers - findTransferByTxHash', () => {
    it('should exist', () => {
      expect(chainTransfersApi.findTransferByTxHash).to.be.a('function')
    })

    it('should pass proper arguments to backend',async () => {
      const result = await chainTransfersApi.findTransferByTxHash('testToken', 'walletId', 'txHash')

      expect(result).to.be.eq('backend response')
      // @ts-ignore
      const [token, walletId, txHash] = backendApi.findTransferByTxHash.mock.calls[0]
      expect(token).to.eq('testToken')
      expect(walletId).to.eq('walletId')
      expect(txHash).to.eq('txHash')
    })
})
