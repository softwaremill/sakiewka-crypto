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
      label: 'testLabel'
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
      label: 'testLabel',
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
