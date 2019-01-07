import { expect, use } from 'chai'

import * as wallet from '../wallet'
import * as backendApi from '../backend-api'
import BigNumber from "bignumber.js";
import chaiBigNumber from 'chai-bignumber'

beforeEach(() => {
  use(chaiBigNumber(BigNumber))
})

describe('createWallet', () => {
  it('should exist', () => {
    expect(wallet.createWallet).to.be.a('function')
  })

  it('should pass proper arguments (when no pub keys provided) to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    backendApi.createWallet = mockImplementation

    const params = {
      passphrase: 'abcd',
      name: 'testLabel'
    }

    const result = await wallet.createWallet('abcd', params)
    const [token, backendRequestParams] = mockImplementation.mock.calls[0]

    expect(token).to.eq('abcd')
    expect(backendRequestParams).to.haveOwnProperty('userPrvKey')
    expect(backendRequestParams).to.haveOwnProperty('backupPrvKey')
    expect(backendRequestParams).to.haveOwnProperty('name')
    expect(backendRequestParams).to.haveOwnProperty('userPubKey')
    expect(backendRequestParams).to.haveOwnProperty('backupPubKey')
    expect(result).to.eq('backend response')

    // check if sending encrypted xprvs
    expect(JSON.parse(backendRequestParams.userPrvKey)).to.haveOwnProperty('ct')
    expect(JSON.parse(backendRequestParams.backupPrvKey)).to.haveOwnProperty('ct')

    // check if really sending xpubs
    expect(backendRequestParams.userPubKey.slice(0, 4)).to.be.eq('xpub')
    expect(backendRequestParams.backupPubKey.slice(0, 4)).to.be.eq('xpub')
  })

  it('should pass proper arguments (when pub keys provided) to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    backendApi.createWallet = mockImplementation

    const params = {
      passphrase: 'abcd',
      name: 'testLabel',
      userPubKey: '123',
      backupPubKey: '321'
    }

    const result = await wallet.createWallet('abcd', params)
    const [token, backendRequestParams] = mockImplementation.mock.calls[0]

    expect(token).to.eq('abcd')
    expect(backendRequestParams).to.not.haveOwnProperty('userPrvKey')
    expect(backendRequestParams).to.not.haveOwnProperty('backupPrvKey')
    expect(backendRequestParams).to.haveOwnProperty('name')
    expect(backendRequestParams).to.haveOwnProperty('userPubKey')
    expect(backendRequestParams).to.haveOwnProperty('backupPubKey')
    expect(result).to.eq('backend response')

    expect(backendRequestParams.userPubKey).to.be.eq('123')
    expect(backendRequestParams.backupPubKey).to.be.eq('321')
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

    const res = await wallet.listWallets('testToken', 10, 'nextPageToken')

    const [token, limit, nextPageToken] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(limit).to.eq(10)
    expect(nextPageToken).to.eq('nextPageToken')
    expect(res).to.eq('backend response')
  })
})

describe('getWalletBalance', () => {
  it('should exist', () => {
    expect(wallet.getWalletBalance).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    backendApi.getWalletBalance = mockImplementation

    const res = await wallet.getWalletBalance('testToken', 'walletId')

    const [token, walletId] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('walletId')
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

    const res = await wallet.listUnspents('testToken', 'walletId', '2', [{ address: '0x1', amount: new BigNumber(123) }])

    const [token, walletId, {feeRate, recipients}] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('walletId')
    expect(feeRate).to.eq('2')
    expect(res).to.eq('backend response')
    // @ts-ignore
    expect(recipients[0].amount).to.be.bignumber.eq(0.00000123)
    expect(recipients[0].address).to.be.eq('0x1')
  })
})
