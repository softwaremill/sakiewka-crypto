import { expect, use } from 'chai'

import { walletApiFactory } from '../../eos/eos-wallet'
import * as backendApiFactory from '../../eos/eos-backend-api'
import BigNumber from 'bignumber.js'
import chaiBigNumber from 'chai-bignumber'
import { keyModuleFactory } from '../../eos/eos-key'

const backendApi = backendApiFactory.create('http://backendApiUrl')
const keyModule = keyModuleFactory()
const wallet = walletApiFactory(backendApi, keyModule)

beforeEach(() => {
  use(chaiBigNumber(BigNumber))
})

describe('createWallet', () => {
  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => ({ servicePubKey: 'pubKey' }))
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
    expect(result.servicePubKey).to.eq('pubKey')

    // check if sending encrypted xprvs
    expect(JSON.parse(backendRequestParams.userPrvKey)).to.haveOwnProperty('ct')
    expect(JSON.parse(backendRequestParams.backupPrvKey)).to.haveOwnProperty('ct')

    // check if really sending xpubs
    expect(backendRequestParams.userPubKey.slice(0, 3)).to.be.eq('EOS')
    expect(backendRequestParams.backupPubKey.slice(0, 3)).to.be.eq('EOS')
  })
})

describe('getWallet', () => {
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