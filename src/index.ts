import * as constants from './lib/constants'
import address from './lib/address'
import * as crypto from './lib/crypto'
import transaction from './lib/transaction'
import wallet from './lib/wallet'
import key from './lib/key'
import * as user from './lib/user'
import * as transfers from './lib/transfers'
import * as config from './lib/config'
import { Currency } from "./types/domain";

export default {
  user,
  transfers,
  config,
  constants,
  crypto,
  [Currency.BTC]: {
    address: address(Currency.BTC),
    transaction: transaction(Currency.BTC),
    wallet: wallet(Currency.BTC),
    key: key(Currency.BTC)
  },
  [Currency.BTG]: {
    address: address(Currency.BTG),
    transaction: transaction(Currency.BTG),
    wallet: wallet(Currency.BTG),
    key: key(Currency.BTG)
  },
}

export { Currency } from './types/domain'
