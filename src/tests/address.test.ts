import { expect } from 'chai'

import * as address from '../address'

describe('generateAddress', () => {
  it('should exist', () => {
    expect(address.generateAddress).to.be.a('function')
  })
})
