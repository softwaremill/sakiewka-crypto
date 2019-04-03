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
import bitcoinOps from './lib/bitcoin'
import { BitcoinOperations } from './lib/bitcoin-operations';

export default async (backendApiUrl: string) => {
  const backendApi = backendApiFactory.create(backendApiUrl)
  const chainInfo = await backendApi.chainInfo()

  const btcBackendApi = backendApiFactory.withCurrency(backendApiUrl, Currency.BTC)
  const btcOps = bitcoinOps(Currency.BTC, chainInfo.chain)

  const btgBackendApi = backendApiFactory.withCurrency(backendApiUrl, Currency.BTG)
  const btgOps = bitcoinOps(Currency.BTG, chainInfo.chain)

  return {
    user: user(backendApi),
    transfers,
    config,
    constants,
    crypto,
    [Currency.BTC]: creatCurrencyModule(btcBackendApi, btcOps),
    [Currency.BTG]: creatCurrencyModule(btgBackendApi, btgOps),
  }
}

function creatCurrencyModule(backendApi: backendApiFactory.CurrencyBackendApi, bitcoinOps: BitcoinOperations) {
  const keyModule = key(backendApi, bitcoinOps)
  return {
    address: address(backendApi, bitcoinOps, keyModule),
    transaction: transaction(backendApi, keyModule, bitcoinOps),
    wallet: wallet(backendApi, keyModule),
    key: keyModule
  };
}


export { Currency } from './types/domain'

