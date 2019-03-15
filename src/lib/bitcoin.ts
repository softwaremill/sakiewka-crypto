import { Currency } from '../types/domain'
import BtgOperations from './btg-operations'
import BtcOperations from "./btc-operations";
import { BitcoinOperations } from "./bitcoin-operations";

const btgOperations = new BtgOperations()
const btcOperations = new BtcOperations()

export default (currency:Currency) : BitcoinOperations => {
  if(currency == Currency.BTC) {
    return btcOperations
  } else if(currency == Currency.BTG) {
    return btgOperations
  } else {
    throw new Error(`No bitcoin operations for ${currency}`)
  }
}