import BigNumber from 'bignumber.js'

export const hourFromNow = (currentBlock: string) =>
  parseInt(currentBlock, 10) + 15 * 4 * 60 // roughly 15 seconds per block

export const btcToSatoshi = (
  amount: BigNumber = new BigNumber('0'),
): BigNumber => amount.shiftedBy(8)
export const satoshiToBtc = (
  amount: BigNumber = new BigNumber('0'),
): BigNumber => amount.shiftedBy(-8)
