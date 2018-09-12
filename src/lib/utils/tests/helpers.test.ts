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

  it('should return an hour later timestamp', () => {
    const hourMiliseconds = 3600000
    const currentTimestamp = new Date().getTime()
    const res = helpers.hourFromNow()

    expect(res).to.be.above(currentTimestamp)
    expect(res).to.be.below(currentTimestamp + hourMiliseconds + 2000)
  })
})
