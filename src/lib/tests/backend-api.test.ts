import { expect } from 'chai'

import * as api from '../backend-api'
import { Wallet } from '../../types/domain'

describe('createWallet', () => {
  it('should exist', () => {
    expect(api.createWallet).to.be.a('function')
  })
})
