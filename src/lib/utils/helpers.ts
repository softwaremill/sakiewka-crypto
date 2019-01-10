import BigNumber from "bignumber.js";

export const hourFromNow = (currentBlock) => (parseInt(currentBlock) + 15 * 4 * 60) // roughly 15 seconds per block

export const btcToSatoshi = (amount: BigNumber): BigNumber => amount.shiftedBy(8)
export const satoshiToBtc = (amount: BigNumber): BigNumber => amount.shiftedBy(-8)