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
    expect(decrypted).to.be.eq(message)
  })

  it('should produce sha512 hash', () => {
    const message = 'testMSG'
    const password = 'abcd'
    const encrypted = crypto.encrypt(password, message)
    const decrypted = crypto.decrypt(password, encrypted)

    expect(JSON.parse(encrypted)).to.have.ownProperty('cipher')
    expect(decrypted).to.be.eq(message)
  })
})

describe('hashSha512', () => {
  it('should exist', () => {
    expect(crypto.hashSha512).to.be.a('function')
  })

  it('should produce sha512 hash', () => {
    const result = crypto.hashSha512('testMessage')

    expect(result).to.have.lengthOf(128)
  })
})

describe('hashPassword', () => {
  it('should exist', () => {
    expect(crypto.hashPassword).to.be.a('function')
  })

  it('should produce hash', () => {
    const result = crypto.hashPassword('testMessage')

    expect(result).to.have.lengthOf(64)
    expect(result).to.eq('1d54362dabeb1ef499cc2c675e4938204e39ce8bb1cfd835821ac1f4e98d03a9')
  })
})

describe('hashSha1', () => {
  it('should exist', () => {
    expect(crypto.hashSha1).to.be.a('function')
  })

  it('should produce hash', () => {
    const result = crypto.hashSha1('testMessage')

    expect(result).to.have.lengthOf(40)
    expect(result).to.eq('d2581121a80ea419e91878d321100cc99dfb21db')
  })
})
