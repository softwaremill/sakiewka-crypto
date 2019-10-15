import { createHttpClient } from '../../utils/httpClient'
import { expect } from 'chai'
import { eosChainTransferApiFactory } from '../../eos/eos-transfer'
import { eosBackendApiFactory } from '../../eos/eos-backend-api'

const backendApi = eosBackendApiFactory(
  'http://backendApiUrl',
  createHttpClient(() => ''),
)
const eosChainTransfersApi = eosChainTransferApiFactory(backendApi)

beforeEach(() => {
  // @ts-ignore
  backendApi.listTransfers = jest.fn(() => 'backend response')
  // @ts-ignore
  backendApi.findTransferByTxHash = jest.fn(() => 'backend response')
})

describe('chain transfers - listTransfers', () => {
  it('should exist', () => {
    expect(eosChainTransfersApi.listTransfers).to.be.a('function')
  })

  it('should pass proper arguments to backend', async () => {
    const result = await eosChainTransfersApi.listTransfers(
      'testToken',
      '123',
      50,
    )

    expect(result).to.be.eq('backend response')
    const [
      token,
      walletId,
      limit,
      nextPageToken,
      // @ts-ignore
    ] = backendApi.listTransfers.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('123')
    expect(limit).to.eq(50)
    expect(nextPageToken).to.be.undefined
  })

  it('should pass nextPageToken to backend', async () => {
    const result = await eosChainTransfersApi.listTransfers(
      'testToken',
      '123',
      50,
      'npt',
    )

    expect(result).to.be.eq('backend response')
    const [
      token,
      walletId,
      limit,
      nextPageToken,
      // @ts-ignore
    ] = backendApi.listTransfers.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('123')
    expect(limit).to.eq(50)
    expect(nextPageToken).to.eq('npt')
  })
})

describe('transfers - findTransferByTxHash', () => {
  it('should exist', () => {
    expect(eosChainTransfersApi.findTransferByTxHash).to.be.a('function')
  })

  it('should pass proper arguments to backend', async () => {
    const result = await eosChainTransfersApi.findTransferByTxHash(
      'testToken',
      'walletId',
      'txHash',
    )

    expect(result).to.be.eq('backend response')
    const [
      token,
      walletId,
      txHash,
      // @ts-ignore
    ] = backendApi.findTransferByTxHash.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('walletId')
    expect(txHash).to.eq('txHash')
  })
})
