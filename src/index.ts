import * as constants from './lib/constants'
import address from './lib/address'
import * as crypto from './lib/crypto'
import * as backendApiFactory from './lib/backend-api'
import transaction from './lib/transaction'
import wallet from './lib/wallet'
import key from './lib/key'
import user from './lib/user'
import * as transfers from './lib/transfers'
import * as config from './lib/config'
import { Currency } from "./types/domain";

export default async (backendApiUrl: string) => {
  const chainInfo = await backendApiFactory.create(backendApiUrl)
  return {
    user: user(backendApiUrl),
    transfers,
    config,
    constants,
    crypto,
    [Currency.BTC]: {
      address: address(backendApiUrl, Currency.BTC),
      transaction: transaction(backendApiUrl, Currency.BTC),
      wallet: wallet(backendApiUrl, Currency.BTC),
      key: key(backendApiUrl, Currency.BTC)
    },
    [Currency.BTG]: {
      address: address(backendApiUrl, Currency.BTG),
      transaction: transaction(backendApiUrl, Currency.BTG),
      wallet: wallet(backendApiUrl, Currency.BTG),
      key: key(backendApiUrl, Currency.BTG)
    }
  }
}

export { Currency } from './types/domain'
