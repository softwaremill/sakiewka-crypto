import { expect } from 'chai'

import * as crypto from '../crypto'

describe('encrypt/decrypt', () => {
  it('should exist', () => {
    expect(crypto.encrypt).to.be.a('function')
  })

  it('should properly encrypt and decrypt message', () => {
    const message = 'testMSG'
    const password = 'abcd'
    const encrypted = crypto.encrypt(password, message)
    const decrypted = crypto.decrypt(password, encrypted)

    expect(JSON.parse(encrypted)).to.have.ownProperty('cipher')
    expect(encrypted).to.not.eq(message).and.not.include(message)
    expect(decrypted).to.be.eq(message)
  })
})

describe('hashUserPassword', () => {
  it('should exist', () => {
    expect(crypto.hashUserPassword).to.be.a('function')
  })

  it('should produce hash', () => {
    const result = crypto.hashUserPassword('testMessage')

    expect(result).to.have.lengthOf(64)
    expect(result).to.eq('e8db9edce462eda233ced6b2a2a8f6e47d70f4f044be8e5cf2e1534691d1c86f')
  })
})

describe('hashSha256', () => {
  it('should exist', () => {
    expect(crypto.hashSha256).to.be.a('function')
  })

  it('should produce hash', () => {
    const result = crypto.hashSha256('testMessage')

    expect(result).to.have.lengthOf(64)
    expect(result).to.eq('d9920dc69e7b8352ea5774041afeaf8eeebd1c4985bae1368c2a5559c12bcb56')
  })
})

describe('hashWalletPassword', function () {
  it('should exist', () => {
    expect(crypto.hashWalletPassword).to.be.a('function')
  })

  it('should produce long key from password', () => {
    const result = crypto.hashWalletPassword('password')
    expect(result).to.eq('50ebd3bfcbaa28188b19aba53da7226da05fa06a70e4acdcde5b16653601832c453475e4e29d3dd7a01febbcf82e39cb02aa8b567f38985309edb38609149769')
  })
});
