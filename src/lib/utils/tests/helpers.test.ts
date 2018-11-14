import { expect } from 'chai'

import * as helpers from '../helpers'

describe('filterObject', () => {
  it('should exist', () => {
    expect(helpers.filterObject).to.be.a('function')
  })

  it('should filter object according to predicate', () => {
    const input = {
      propOne: 123,
      propTwo: 124,
      propThree: 125,
      propFour: 126
    }
    const predicate = (el: number) => el > 124
    const res = helpers.filterObject(input, predicate)

    expect(res).to.haveOwnProperty('propThree')
    expect(res).to.haveOwnProperty('propFour')
    expect(res).to.not.haveOwnProperty('propOne')
    expect(res).to.not.haveOwnProperty('propTwo')
  })
})

describe('removeUndefinedFromObjec', () => {
  it('should exist', () => {
    expect(helpers.removeUndefinedFromObject).to.be.a('function')
  })

  it('should filter out object properties containing undefined values', () => {
    const input = {
      propOne: 123,
      propTwo: undefined,
      propThree: 125,
      propFour: undefined
    }
    const res = helpers.removeUndefinedFromObject(input)

    expect(res).to.haveOwnProperty('propOne')
    expect(res).to.haveOwnProperty('propThree')
    expect(res).to.not.haveOwnProperty('propTwo')
    expect(res).to.not.haveOwnProperty('propFour')
  })
})

describe('hourFromNow', () => {
  it('should exist', () => {
    expect(helpers.hourFromNow).to.be.a('function')
  })

  it('should return around hour later treating one block as 15 seconds', () => {
    const blockPerHour = 4 * 15 * 60
    const currentBlock = 1234
    const res = helpers.hourFromNow(currentBlock)

    expect(res).to.be.eq(currentBlock + blockPerHour)
  })
})
