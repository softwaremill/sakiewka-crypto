import { expect } from 'chai'

import * as crypto from '../crypto'

describe('encrypt', () => {
  it('should exist', () => {
    expect(crypto.encrypt).to.be.a('function')
  })
})
