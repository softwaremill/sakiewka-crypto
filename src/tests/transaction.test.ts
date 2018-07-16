import { expect } from 'chai'
import * as transaction from '../transaction'

describe('sendTransaction', () => {
  it('should exist', () => {
    expect(transaction.sendTransaction).to.be.a('function')
  })
})
