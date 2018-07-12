import { expect } from 'chai'
import * as main from '../main'

describe('createWallet', () => {
  it('should exist', () => {
    expect(main.createWallet).to.be.a('function')
  })
})
