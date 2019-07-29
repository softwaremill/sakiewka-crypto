import { Currency } from '../../types/domain/currency'
import BtgOperations from './btg-operations'
import BtcOperations from './btc-operations'
import { BitcoinOperations } from './bitcoin-operations'
import { networkFactory } from '../config'

export default (currency: Currency, btcNetwork: string): BitcoinOperations => {
  if (currency === Currency.BTC) {
    return new BtcOperations(networkFactory(btcNetwork, currency))
  }
  if (currency === Currency.BTG) {
    return new BtgOperations(networkFactory(btcNetwork, currency))
  }
  throw new Error(`No bitcoin operations for ${currency}`)
}
