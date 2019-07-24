// import { expect, use } from 'chai'

// import * as helpers from '../helpers'
// import BigNumber from 'bignumber.js'
// import chaiBigNumber from 'chai-bignumber'

// beforeEach(() => {
//   use(chaiBigNumber(BigNumber))
// })

// describe('hourFromNow', () => {
//   it('should exist', () => {
//     expect(helpers.hourFromNow).to.be.a('function')
//   })

//   it('should return around hour later treating one block as 15 seconds', () => {
//     const blockPerHour = 4 * 15 * 60
//     const currentBlock = 1234
//     const res = helpers.hourFromNow(currentBlock)

//     expect(res).to.be.eq(currentBlock + blockPerHour)
//   })
// })

// describe('convert btc to satoshi and satoshi to btc', () => {
//   it('should convert btc to satoshi', () => {
//     // @ts-ignore
//     expect(
//       helpers.btcToSatoshi(new BigNumber('0.00000001')),
//     ).to.be.bignumber.eq(new BigNumber('1'))
//     // @ts-ignore
//     expect(helpers.btcToSatoshi(new BigNumber('100000'))).to.be.bignumber.eq(
//       new BigNumber('10000000000000'),
//     )
//     // @ts-ignore
//     expect(helpers.btcToSatoshi(new BigNumber('1.2'))).to.be.bignumber.eq(
//       new BigNumber('120000000'),
//     )
//     // @ts-ignore
//     expect(
//       helpers.btcToSatoshi(new BigNumber('0.29985356')),
//     ).to.be.bignumber.eq(new BigNumber('29985356'))
//   })

//   it('should convert satoshi to btc', () => {
//     // @ts-ignore
//     expect(helpers.satoshiToBtc(new BigNumber('1'))).to.be.bignumber.eq(
//       new BigNumber('0.00000001'),
//     )
//     // @ts-ignore
//     expect(
//       helpers.satoshiToBtc(new BigNumber('10000000000000')),
//     ).to.be.bignumber.eq(new BigNumber('100000'))
//     // @ts-ignore
//     expect(helpers.satoshiToBtc(new BigNumber('120000000'))).to.be.bignumber.eq(
//       new BigNumber('1.2'),
//     )
//     // @ts-ignore
//     expect(helpers.satoshiToBtc(new BigNumber('29985356'))).to.be.bignumber.eq(
//       new BigNumber('0.29985356'),
//     )
//   })
// })
