import { Currency } from '../types/domain'
import BtgOperations from './btg-operations'
import BtcOperations from "./btc-operations";
import { BitcoinOperations } from "./bitcoin-operations";

export default (currency: Currency, btcNetwork: string): BitcoinOperations => {
  if (currency == Currency.BTC) {
    return new BtcOperations(btcNetwork)
  } else if (currency == Currency.BTG) {
    return new BtgOperations(btcNetwork)
  } else {
    throw new Error(`No bitcoin operations for ${currency}`)
  }
}