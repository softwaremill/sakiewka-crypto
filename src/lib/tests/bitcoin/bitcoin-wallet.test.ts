import { expect, use } from 'chai'

import { currency } from '../helpers'
import { walletApiFactory } from '../../bitcoin/bitcoin-wallet'
import * as backendApiFactory from '../../bitcoin/bitcoin-backend-api'
import BigNumber from 'bignumber.js'
import chaiBigNumber from 'chai-bignumber'
import * as pdfGen from '../../bitcoin/bitcoin-keycard-pdf'
import { keyModuleFactory } from '../../bitcoin/bitcoin-key'
import bitcoinFactory from '../../bitcoin/bitcoin'
import { createHttpClient } from '../../utils/httpClient'
import chaiAsPromised from 'chai-as-promised'
import { API_ERROR } from '../../constants'

const backendApi = backendApiFactory.withCurrency(
  'http://backendApiUrl',
  currency,
  createHttpClient(() => ''),
)

const bitcoinOperation = bitcoinFactory(currency, 'mainnet')
const keyModule = keyModuleFactory(bitcoinOperation)
const wallet = walletApiFactory(backendApi, keyModule)

beforeEach(() => {
  use(chaiBigNumber(BigNumber))
  use(chaiAsPromised)
})

describe('createWallet', () => {
  it('should exist', () => {
    expect(wallet.createWallet).to.be.a('function')
  })

  it('should fail if password is too short', async () => {
    const promise = wallet.createWallet('abcd', {
      passphrase: 'aaa',
      name: 'testLabel',
    })
    await expect(promise)
      .to.eventually.be.rejected.and.have.property('errors')
      .that.deep.include(API_ERROR.PASSPHRASE_TOO_SHORT(8).errors[0])
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => ({ servicePubKey: 'pubKey' }))
    // @ts-ignore
    backendApi.createWallet = mockImplementation
    // @ts-ignore
    const mockPdfGen = jest.fn(() => 'pdf')
    // @ts-ignore
    pdfGen.generatePdf = mockPdfGen

    const params = {
      passphrase: 'abcdabcd',
      name: 'testLabel',
    }

    const result = await wallet.createWallet('abcd', params)
    const [token, backendRequestParams] = mockImplementation.mock.calls[0]

    expect(token).to.eq('abcd')
    expect(backendRequestParams).to.haveOwnProperty('userPrvKey')
    expect(backendRequestParams).to.haveOwnProperty('backupPrvKey')
    expect(backendRequestParams).to.haveOwnProperty('name')
    expect(backendRequestParams).to.haveOwnProperty('userPubKey')
    expect(backendRequestParams).to.haveOwnProperty('backupPubKey')
    expect(result.pdf).to.eq('pdf')

    // check if sending encrypted xprvs
    expect(JSON.parse(backendRequestParams.userPrvKey)).to.haveOwnProperty(
      'ct',
    )
    expect(JSON.parse(backendRequestParams.backupPrvKey)).to.haveOwnProperty(
      'ct',
    )

    // check if really sending xpubs
    expect(backendRequestParams.userPubKey.slice(0, 4)).to.be.eq('xpub')
    expect(backendRequestParams.backupPubKey.slice(0, 4)).to.be.eq('xpub')
  })
})

describe('editWallet', () => {
  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => ({}))
    // @ts-ignore
    backendApi.editWallet = mockImplementation

    await wallet.editWallet('token', 'walletId', 'newWalletName')
    const [token, walletId, newWalletName] = mockImplementation.mock.calls[0]

    expect(token).to.eq('token')
    expect(walletId).to.eq('walletId')
    expect(newWalletName).to.eq('newWalletName')
  })
})

describe('getWallet', () => {
  it('should exist', () => {
    expect(wallet.getWallet).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    backendApi.getWallet = mockImplementation

    const res = await wallet.getWallet('testToken', 'walletId')

    const [token, walletId] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('walletId')
    expect(res).to.eq('backend response')
  })
})

describe('listWallets', () => {
  it('should exist', () => {
    expect(wallet.listWallets).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    backendApi.listWallets = mockImplementation

    const res = await wallet.listWallets(
      'testToken',
      10,
      'wallet3',
      'nextPageToken',
    )

    const [
      token,
      limit,
      searchPhrase,
      nextPageToken,
    ] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(limit).to.eq(10)
    expect(searchPhrase).to.eq('wallet3')
    expect(nextPageToken).to.eq('nextPageToken')
    expect(res).to.eq('backend response')
  })
})

describe('listUnspents', () => {
  it('should exist', () => {
    expect(wallet.listUnspents).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    backendApi.listUnspents = mockImplementation

    const res = await wallet.listUnspents(
      'testToken',
      'walletId',
      [
        {
          address: '0x1',
          amount: new BigNumber('0.00000123'),
        },
      ],
      2,
    )

    const [
      token,
      walletId,
      { feeRate, recipients },
    ] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('walletId')
    expect(feeRate).to.eq(2)
    expect(res).to.eq('backend response')
    // @ts-ignore
    expect(recipients[0].amount).to.be.bignumber.eq(0.00000123)
    expect(recipients[0].address).to.be.eq('0x1')
  })
})

describe('getMaxTransferAmount', () => {
  it('should exist', () => {
    expect(wallet.maxTransferAmount).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    backendApi.maxTransferAmount = mockImplementation

    const res = await wallet.maxTransferAmount(
      'testToken',
      'walletId',
      2,
      '0x1',
    )

    const [
      token,
      walletId,
      { recipient, feeRate },
    ] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('walletId')
    expect(feeRate).to.eq(2)
    expect(res).to.eq('backend response')
    expect(recipient).to.be.eq('0x1')
  })
})

describe('listPoliciesForWallet', () => {
  it('should exist', () => {
    expect(wallet.listPoliciesForWallet).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    backendApi.listPoliciesForWallet = mockImplementation

    const res = await wallet.listPoliciesForWallet('testToken', '11')

    const [token, walletId] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('11')
    expect(res).to.eq('backend response')
  })
})

describe('list utxos by address', () => {
  it('should exist', () => {
    expect(wallet.listUtxosByAddress).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    backendApi.listUtxosByAddress = mockImplementation

    const res = await wallet.listUtxosByAddress(
      'testToken',
      '11',
      'some-address',
      11,
      'nextpagetoken',
    )

    const [
      token,
      walletId,
      address,
      limit,
      nextPageToken,
    ] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('11')
    expect(address).to.eq('some-address')
    expect(limit).to.eq(11)
    expect(nextPageToken).to.eq('nextpagetoken')
    expect(res).to.eq('backend response')
  })
})
