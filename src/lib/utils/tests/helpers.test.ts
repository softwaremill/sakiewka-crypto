import { expect, use } from 'chai'

import * as helpers from '../helpers'
import BigNumber from "bignumber.js";
import chaiBigNumber from 'chai-bignumber'

beforeEach(() => {
  use(chaiBigNumber(BigNumber))
})

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

describe('convert btc to satoshi and satoshi to btc',() => {
  it('should convert btc to satoshi',() => {
    // @ts-ignore
    expect(helpers.btcToSatoshi(new BigNumber('0.00000001'))).to.be.bignumber.eq(new BigNumber('1'))
    // @ts-ignore
    expect(helpers.btcToSatoshi(new BigNumber('100000'))).to.be.bignumber.eq(new BigNumber('10000000000000'))
    // @ts-ignore
    expect(helpers.btcToSatoshi(new BigNumber('1.2'))).to.be.bignumber.eq(new BigNumber('120000000'))
    // @ts-ignore
    expect(helpers.btcToSatoshi(new BigNumber('0.29985356'))).to.be.bignumber.eq(new BigNumber('29985356'))
  })

  it('should convert satoshi to btc',() => {
    // @ts-ignore
    expect(helpers.satoshiToBtc(new BigNumber('1'))).to.be.bignumber.eq(new BigNumber('0.00000001'))
    // @ts-ignore
    expect(helpers.satoshiToBtc(new BigNumber('10000000000000'))).to.be.bignumber.eq(new BigNumber('100000'))
    // @ts-ignore
    expect(helpers.satoshiToBtc(new BigNumber('120000000'))).to.be.bignumber.eq(new BigNumber('1.2'))
    // @ts-ignore
    expect(helpers.satoshiToBtc(new BigNumber('29985356'))).to.be.bignumber.eq(new BigNumber('0.29985356'))
  })
})

