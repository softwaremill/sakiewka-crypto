import { expect } from 'chai'

import * as api from '../backend-api'
import { Wallet, Keychain } from '../domain'

describe('createWallet', () => {
  it('should exist', () => {
    expect(api.createWallet).to.be.a('function')
  })

  it('should return a promise', () => {
    const result = api.createWallet([{
      xprv: 'aaa',
      xpub: 'bbb',
      label: 'usr'
    }])

    expect(result).to.be.a('promise')
  })

  it('should return a promise resolving to a wallet', () => {
    const result = api.createWallet([{
      xprv: 'aaa',
      xpub: 'bbb',
      label: 'usr'
    }])

    result.then((res: Wallet) => {
      expect(res).to.be.a('string')
    })
  })
})
