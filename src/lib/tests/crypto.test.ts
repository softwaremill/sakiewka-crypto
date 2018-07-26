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
