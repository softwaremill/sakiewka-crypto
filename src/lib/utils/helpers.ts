import BigNumber from "bignumber.js";

export const filterObject = (obj: object, predicate: Function): object => {
  const objKeys = Object.keys(obj)

  return objKeys.reduce(
    (acc: object, key: string) => {
      const newAcc = { ...acc }
      if (predicate(obj[key])) newAcc[key] = obj[key]
      return newAcc
    },
    {}
  )
}

export const removeUndefinedFromObject = (obj: object): object => {
  return filterObject(obj, (value: any) => value !== undefined)
}

export const hourFromNow = (currentBlock) => (parseInt(currentBlock) + 15 * 4 * 60) // roughly 15 seconds per block

export const btcToSatoshi = (amount: BigNumber): BigNumber => amount.shiftedBy(8)
export const satoshiToBtc = (amount: BigNumber): BigNumber => amount.shiftedBy(-8)