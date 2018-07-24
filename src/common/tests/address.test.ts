import { expect } from 'chai'
import bitcoinjsLib from 'bitcoinjs-lib'

import * as address from '../address'
import * as wallet from '../wallet'

describe('generateNewMultisigAddress', () => {
  it('should exist', () => {
    expect(address.generateNewMultisigAddress).to.be.a('function')
  })

  it('should return proper address', () => {
    const pubKeys = [
      '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
      '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
      '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59'
    ].map((hex: string) => bitcoinjsLib.HDNode.fromSeedBuffer(Buffer.from(hex, 'hex')).toBase58())

    const result = address.generateNewMultisigAddress(
      pubKeys,
      '0/23')

    expect(result).to.be.equal('38zHqEAEASmZuaizXdz4G7fenwtsFD6Cak')
  })
})

describe('deriveChildKey', () => {
  it('should exist', () => {
    expect(address.deriveKey).to.be.a('function')
  })

  it('should create new hardened key for a given path', () => {
    const path = `0'`
    const keychain = wallet.generateNewKeypair()

    const result = address.deriveKey(keychain.privKey, path)

    expect(result).to.have.property('keyPair')
  })

  it('should create new normal key for a given path', () => {
    const path = `11/20/15`
    const keychain = wallet.generateNewKeypair()

    const result = address.deriveKey(keychain.pubKey, path)

    expect(result).to.have.property('keyPair')
  })
})
