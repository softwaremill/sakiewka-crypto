import BigNumber from 'bignumber.js'
import { Currency } from '../../types/domain/currency'

export const hourFromNow = (currentBlock: number | string) =>
  Number(currentBlock) + 15 * 4 * 60 // roughly 15 seconds per block

export const btcToSatoshi = (
  amount: BigNumber = new BigNumber('0'),
): BigNumber => amount.shiftedBy(8)
export const satoshiToBtc = (
  amount: BigNumber = new BigNumber('0'),
): BigNumber => amount.shiftedBy(-8)

type TestFunc = (Currency) => void | PromiseLike<void>

const forMultipleCurrencies = (currencies:Currency[]) => (testName, testFunc: TestFunc) => {
  currencies.forEach(currency => {
    const mochaFunc = () => testFunc(currency)
    describe(`${currency} > ${testName}`, mochaFunc)
  })
}

export const forBTCandBTG = forMultipleCurrencies([Currency.BTC, Currency.BTG])

export const forAllCurrencies = forMultipleCurrencies([Currency.BTC, Currency.BTG, Currency.EOS])
