import { expect } from 'chai'

import * as api from '../backend-api'

describe('createWallet', () => {
  it('should exist', () => {
    expect(api.createWallet).to.be.a('function')
  })
})
