import { expect } from 'chai'

import * as wallet from '../wallet'
import * as backendApi from '../backend-api'

// @ts-ignore
backendApi.createWallet = jest.fn(() => {
  return Promise.resolve({
    id: '123'
  })
})

describe('generateNewKeypair', () => {
  it('should exist', () => {
    expect(wallet.generateNewKeypair).to.be.a('function')
  })

  it('should return new keypair', () => {
    const result = wallet.generateNewKeypair()

    expect(result).to.haveOwnProperty('pubKey')
    expect(result).to.haveOwnProperty('prvKey')
    expect(result.pubKey).to.have.lengthOf(111)
    expect(result.prvKey).to.have.lengthOf(111)
  })
})

describe('encryptKeyPair', () => {
  it('should exist', () => {
    expect(wallet.encryptKeyPair).to.be.a('function')
  })

  it('should return encrypted keypair', () => {
    const result = wallet.encryptKeyPair({ pubKey: 'abc', prvKey: 'bcd' }, 'pass')

    expect(result).to.haveOwnProperty('pubKey')
    expect(result).to.haveOwnProperty('prvKey')
    expect(result.pubKey).to.have.lengthOf(3)
    expect(JSON.parse(result.prvKey)).to.haveOwnProperty('cipher')
  })
})

describe('createWallet', () => {
  it('should exist', () => {
    expect(wallet.createWallet).to.be.a('function')
  })

  it('should return keypairs and wallet id', async () => {
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

describe('deriveChildKey', () => {
  it('should exist', () => {
    expect(wallet.deriveKey).to.be.a('function')
  })

  it('should create new hardened key for a given path', () => {
    const path = `0'`
    const keychain = wallet.generateNewKeypair()

    const result = wallet.deriveKey(keychain.prvKey, path)

    expect(result).to.have.property('keyPair')
  })

  it('should create new normal key for a given path', () => {
    const path = `11/20/15`
    const keychain = wallet.generateNewKeypair()

    const result = wallet.deriveKey(keychain.pubKey, path)

    expect(result).to.have.property('keyPair')
  })

  it('should work the same for relative and absolute paths', () => {
    const basePath = `m/45'/0`
    const relativePath = '0/0'

    const rootPrvKey = 'xprv9s21ZrQH143K27LPi9gM65jmXFuBfiY7S5HReQarD7dTX9svAXQmQYsqxVqMcbtRWxDwBkdRxSxhfPBX4Vt7Juc9CqY4i3AaPNwCeM1w1Ym'
    const pubKey = 'xpub661MyMwAqRbcEbQrpBDMTDgW5Hjg5BFxoJD2SnzTmTASPxD4i4j1xMCKojYwgaRXXBRAHB7WPECxA2aQVfL61G4mWjnHMj6BJtAQKMVAiYs'

    const partialResult = wallet.deriveKey(rootPrvKey, basePath)
    const partialPrvKey = partialResult.toBase58()
    const partialPubKey = partialResult.neutered().toBase58()

    const relativeResult = wallet.deriveKey(partialPrvKey, relativePath)
    const relativePrvKey = relativeResult.toBase58()
    const relativePubKey = relativeResult.neutered().toBase58()

    const absoluteResult = wallet.deriveKey(rootPrvKey, `${basePath}/${relativePath}`)
    const absolutePrvKey = absoluteResult.toBase58()
    const absolutePubKey = absoluteResult.neutered().toBase58()

    const relativeResultFromPublic = wallet.deriveKey(partialPubKey, relativePath)
    const relativePubKeyFromPublic = relativeResultFromPublic.toBase58()

    expect(relativePrvKey).to.eq(absolutePrvKey)
    expect(relativePubKey).to.eq(absolutePubKey)
    expect(relativePubKeyFromPublic).to.eq(absolutePubKey)
  })
})

describe('deriveKeypair', () => {
  it('should exist', () => {
    expect(wallet.deriveKeypair).to.be.a('function')
  })

  it('should create new keypair with derived pubKey', () => {
    const path = `0'`
    const rootKeypair = wallet.generateNewKeypair()

    const derivedKeypair = wallet.deriveKeypair(rootKeypair, path)

    expect(rootKeypair.prvKey).to.eq(derivedKeypair.prvKey)
    expect(rootKeypair.pubKey).to.not.eq(derivedKeypair.pubKey)
  })

  it('should create new keypair with derived bothKeys', () => {
    const path = `0'`
    const rootKeypair = wallet.generateNewKeypair()

    const derivedKeypair = wallet.deriveKeypair(rootKeypair, path, false)

    expect(rootKeypair.prvKey).to.not.eq(derivedKeypair.prvKey)
    expect(rootKeypair.pubKey).to.not.eq(derivedKeypair.pubKey)
  })
})
