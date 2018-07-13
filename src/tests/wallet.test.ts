import { expect } from 'chai'

import * as wallet from '../wallet'
import { Wallet } from '../interfaces'

describe('createWallet', () => {
  it('should exist', () => {
    expect(wallet.createWallet).to.be.a('function')
  })

  it('should return a wallet', () => {
    const params = {
      password: 'abcd'
    }

    const result = wallet.createWallet(params)

    result.then((res: Wallet) => {
      expect(res).to.be.an('object')
    })
  })
})

describe('createKeychain', () => {
  it('should exist', () => {
    expect(wallet.createKeychain).to.be.a('function')
  })

  it('should generate pair of keys', () => {
    const result = wallet.createKeychain('testLabel')

    expect(result).to.be.a('object')
    expect(result.xpub).to.have.lengthOf(111)
    expect(result.xprv).to.have.lengthOf(111)
    expect(result.xpub.slice(0, 4)).to.be.equal('xpub')
    expect(result.xprv.slice(0, 4)).to.be.equal('xprv')
  })
})
