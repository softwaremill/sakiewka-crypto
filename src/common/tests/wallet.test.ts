import { expect } from 'chai'

import * as wallet from '../wallet'

describe('generateNewKeypair', () => {
  it('should exist', () => {
    expect(wallet.generateNewKeypair).to.be.a('function')
  })

  it('should return new keypair', () => {
    const result = wallet.generateNewKeypair()

    expect(result).to.haveOwnProperty('pubKey')
    expect(result).to.haveOwnProperty('privKey')
    expect(result.pubKey).to.have.lengthOf(111)
    expect(result.privKey).to.have.lengthOf(111)
  })
})

describe('encryptKeyPair', () => {
  it('should exist', () => {
    expect(wallet.encryptKeyPair).to.be.a('function')
  })

  it('should return encrypted keypair', () => {
    const result = wallet.encryptKeyPair({ pubKey: 'abc', privKey: 'bcd' }, 'pass')

    expect(result).to.haveOwnProperty('pubKey')
    expect(result).to.haveOwnProperty('privKey')
    expect(result.pubKey).to.have.lengthOf(3)
    expect(JSON.parse(result.privKey)).to.haveOwnProperty('cipher')
  })
})

describe('prepareKeypairs', () => {
  it('should exist', () => {
    expect(wallet.prepareKeypairs).to.be.a('function')
  })

  it('should return newly generated keypairs', () => {
    const params = {
      passphrase: 'abcd'
    }

    const result = wallet.prepareKeypairs(params)

    expect(result).to.haveOwnProperty('user')
    expect(result).to.haveOwnProperty('backup')
    expect(result.user.privKey).to.have.lengthOf(298)
    expect(result.backup.privKey).to.have.lengthOf(298)
  })

  it('should return keys from params', () => {
    const params = {
      passphrase: 'abcd',
      userPubKey: '123',
      backupPubKey: '321'
    }

    const result = wallet.prepareKeypairs(params)

    expect(result).to.haveOwnProperty('user')
    expect(result).to.haveOwnProperty('backup')
    expect(result.user).to.not.haveOwnProperty('privKey')
    expect(result.backup).to.not.haveOwnProperty('privKey')
  })

  it('should combine params key with newly generated key', () => {
    const params = {
      passphrase: 'abcd',
      backupPubKey: '321'
    }

    const result = wallet.prepareKeypairs(params)

    expect(result).to.haveOwnProperty('user')
    expect(result).to.haveOwnProperty('backup')
    expect(result.user.privKey).to.have.lengthOf(298)
    expect(result.backup).to.not.haveOwnProperty('privKey')
  })
})
