import { expect } from 'chai'

import * as wallet from '../wallet'
import * as backendApi from '../backend-api'

// @ts-ignore
backendApi.createWallet = jest.fn(() => {
  return Promise.resolve({
    id: '123'
  })
})

describe('createWallet', () => {
  it('should exist', () => {
    expect(wallet.createWallet).to.be.a('function')
  })

  it('should return keyPairs and wallet id', async () => {
    const params = {
      passphrase: 'abcd',
      name: 'testLabel'
    }

    const result = await wallet.createWallet('abcd', params)

    expect(result).to.haveOwnProperty('walletId')
    expect(result).to.haveOwnProperty('user')
    expect(result).to.haveOwnProperty('backup')
    expect(result.backup.prvKey.slice(0, 4)).to.be.eq('xprv')
    expect(result.user.pubKey.slice(0, 4)).to.be.eq('xpub')
  })

  it('should not return private key when public key provided', async () => {
    const params = {
      passphrase: 'abcd',
      name: 'testLabel',
      userPubKey: '123',
      backupPubKey: '321'
    }

    const result = await wallet.createWallet('abcd', params)

    expect(result.user).to.not.haveOwnProperty('prvKey')
    expect(result.user).to.haveOwnProperty('pubKey')
    expect(result.backup).to.not.haveOwnProperty('prvKey')
    expect(result.backup).to.haveOwnProperty('pubKey')
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
    wallet.getWallet = mockImplementation

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
    wallet.listWallets = mockImplementation

    const res = await wallet.listWallets('testToken', 10, 'nextPageToken')

    const [token, limit, nextPageToken] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(limit).to.eq(10)
    expect(nextPageToken).to.eq('nextPageToken')
    expect(res).to.eq('backend response')
  })
})
