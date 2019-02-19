import { expect } from 'chai'

import * as keyModule from '../key'
import * as backendApi from '../backend-api'
import * as config from '../config'
import { SUPPORTED_NETWORKS } from '../constants'

// @ts-ignore
backendApi.createWallet = jest.fn(() => {
  return Promise.resolve({
    id: '123'
  })
})

beforeEach(() => {
  // @ts-ignore
  config.network = SUPPORTED_NETWORKS.bitcoin
})

describe('generateNewKeyPair', () => {
  it('should exist', () => {
    expect(keyModule.generateNewKeyPair).to.be.a('function')
  })

  it('should return new keyPair', () => {
    const result = keyModule.generateNewKeyPair()

    expect(result).to.haveOwnProperty('pubKey')
    expect(result).to.haveOwnProperty('prvKey')
    expect(result.pubKey).to.have.lengthOf(111)
    expect(result.prvKey).to.have.lengthOf(111)
    expect(result.pubKey.slice(0, 4)).to.eq('xpub')
  })

  it('should return new testnet keyPair', () => {
    // @ts-ignore
    config.network = SUPPORTED_NETWORKS.testnet
    const result = keyModule.generateNewKeyPair()

    expect(result).to.haveOwnProperty('pubKey')
    expect(result).to.haveOwnProperty('prvKey')
    expect(result.pubKey).to.have.lengthOf(111)
    expect(result.prvKey).to.have.lengthOf(111)
    expect(result.pubKey.slice(0, 4)).to.eq('tpub')
  })

  it('should return new regtest keyPair', () => {
    // @ts-ignore
    config.network = SUPPORTED_NETWORKS.regtest
    const result = keyModule.generateNewKeyPair()

    expect(result).to.haveOwnProperty('pubKey')
    expect(result).to.haveOwnProperty('prvKey')
    expect(result.pubKey).to.have.lengthOf(111)
    expect(result.prvKey).to.have.lengthOf(111)
    expect(result.pubKey.slice(0, 4)).to.eq('tpub')
  })
})

describe('encryptKeyPair', () => {
  it('should exist', () => {
    expect(keyModule.encryptKeyPair).to.be.a('function')
  })

  it('should return encrypted keyPair', () => {
    const result = keyModule.encryptKeyPair({ pubKey: 'abc', prvKey: 'bcd' }, 'pass')

    expect(result).to.haveOwnProperty('pubKey')
    expect(result).to.haveOwnProperty('prvKey')
    expect(result.pubKey).to.have.lengthOf(3)
    expect(JSON.parse(result.prvKey!)).to.haveOwnProperty('cipher')
  })
})

describe('deriveKey', () => {
  it('should exist', () => {
    expect(keyModule.deriveKey).to.be.a('function')
  })

  it('should create new hardened key for a given path', () => {
    const path = `0'`
    const keyPair = keyModule.generateNewKeyPair()

    const result = keyModule.deriveKey(keyPair.prvKey!, path)

    expect(result).to.have.property('keyPair')
  })

  it('should create new normal key for a given path', () => {
    const path = `11/20/15`
    const keyPair = keyModule.generateNewKeyPair()

    const result = keyModule.deriveKey(keyPair.pubKey, path)

    expect(result).to.have.property('keyPair')
    expect(result.toBase58().slice(0, 4)).to.eq('xpub')
  })

  it('should work the same for relative and absolute paths', () => {
    const basePath = `m/45'/0`
    const relativePath = '0/0'

    const rootPrvKey = 'xprv9s21ZrQH143K27LPi9gM65jmXFuBfiY7S5HReQarD7dTX9svAXQmQYsqxVqMcbtRWxDwBkdRxSxhfPBX4Vt7Juc9CqY4i3AaPNwCeM1w1Ym'

    const partialResult = keyModule.deriveKey(rootPrvKey, basePath)
    const partialPrvKey = partialResult.toBase58()
    const partialPubKey = partialResult.neutered().toBase58()

    const relativeResult = keyModule.deriveKey(partialPrvKey, relativePath)
    const relativePrvKey = relativeResult.toBase58()
    const relativePubKey = relativeResult.neutered().toBase58()

    const absoluteResult = keyModule.deriveKey(rootPrvKey, `${basePath}/${relativePath}`)
    const absolutePrvKey = absoluteResult.toBase58()
    const absolutePubKey = absoluteResult.neutered().toBase58()

    const relativeResultFromPublic = keyModule.deriveKey(partialPubKey, relativePath)
    const relativePubKeyFromPublic = relativeResultFromPublic.toBase58()

    expect(relativePrvKey).to.eq(absolutePrvKey)
    expect(relativePubKey).to.eq(absolutePubKey)
    expect(relativePubKeyFromPublic).to.eq(absolutePubKey)
  })

  it('should create testnet key', () => {
    // @ts-ignore
    config.network = SUPPORTED_NETWORKS.testnet
    const path = `11/20/15`
    const keyPair = keyModule.generateNewKeyPair()

    const result = keyModule.deriveKey(keyPair.pubKey, path)

    expect(result).to.have.property('keyPair')
    expect(result.toBase58().slice(0, 4)).to.eq('tpub')
  })
})

describe('deriveKeyPair', () => {
  it('should exist', () => {
    expect(keyModule.deriveKeyPair).to.be.a('function')
  })

  it('should create new keyPair with derived pubKey', () => {
    const path = `0'`
    const rootKeyPair = keyModule.generateNewKeyPair()

    const derivedKeyPair = keyModule.deriveKeyPair(rootKeyPair, path)

    expect(rootKeyPair.prvKey).to.not.eq(derivedKeyPair.prvKey)
    expect(rootKeyPair.pubKey).to.not.eq(derivedKeyPair.pubKey)
  })
})

describe('getKey', () => {
  it('should exist', () => {
    expect(keyModule.getKey).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    keyModule.getKey = mockImplementation

    const res = await keyModule.getKey('testToken', 'abcd')

    const [token, keyId, includePrivate] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(keyId).to.eq('abcd')
    expect(includePrivate).to.eq(undefined)
    expect(res).to.eq('backend response')
  })
})
