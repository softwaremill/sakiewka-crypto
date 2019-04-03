import * as constants from './lib/constants'
import { addressApiFactory, addressModuleFactory } from './lib/address'
import * as crypto from './lib/crypto'
import * as backendApiFactory from './lib/backend-api'
import { transactionApiFactory, transactionModuleFactory } from './lib/transaction'
import { walletApiFactory } from './lib/wallet'
import { keyApiFactory, keyModuleFactory } from './lib/key'
import user from './lib/user'
import * as transfers from './lib/transfers'
import { Currency } from "./types/domain";
import bitcoinOps from './lib/bitcoin'
import { BitcoinOperations } from './lib/bitcoin-operations';

export const sakiewkaApi = async (backendApiUrl: string) => {
  const backendApi = backendApiFactory.create(backendApiUrl)
  const chainInfo = await backendApi.chainInfo()

  const btcBackendApi = backendApiFactory.withCurrency(backendApiUrl, Currency.BTC)
  const btcOps = bitcoinOps(Currency.BTC, chainInfo.chain)

  const btgBackendApi = backendApiFactory.withCurrency(backendApiUrl, Currency.BTG)
  const btgOps = bitcoinOps(Currency.BTG, chainInfo.chain)

  function creatCurrencyApi(backendApi: backendApiFactory.CurrencyBackendApi, bitcoinOps: BitcoinOperations) {
    const keyApi = keyApiFactory(backendApi)
    const keyModule = keyModuleFactory(bitcoinOps)
    const walletApi = walletApiFactory(backendApi, keyModule)
    return {
      address: addressApiFactory(backendApi),
      transaction: transactionApiFactory(backendApi, keyModule, bitcoinOps, walletApi),
      wallet: walletApi,
      key: keyApi
    };
  }

  return {
    user: user(backendApi),
    transfers,
    [Currency.BTC]: creatCurrencyApi(btcBackendApi, btcOps),
    [Currency.BTG]: creatCurrencyApi(btgBackendApi, btgOps),
  }
}

export const sakiewkaModule = (currency: Currency, btcNetwork: string) => {
  const bitcoinOperations = bitcoinOps(currency, btcNetwork);
  const keyModule = keyModuleFactory(bitcoinOperations)
  const transactionModule = transactionModuleFactory(keyModule, bitcoinOperations)
  const addressModule = addressModuleFactory(bitcoinOperations, keyModule)
  return {
    transaction: transactionModule,
    address: addressModule,
    key: keyModule,
    bitcoin: bitcoinOperations,
  }
}


export { Currency } from './types/domain'
export { constants }
export { crypto }