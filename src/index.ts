import * as constants from './lib/constants'
import { addressApiFactory, addressModuleFactory, AddressApi, AddressModule } from './lib/address'
import * as crypto from './lib/crypto'
import { SakiewkaBackend, backendFactory } from './lib/backend-api'
import { transactionApiFactory, transactionModuleFactory, TransactionApi, TransactionModule } from './lib/transaction'
import { walletApiFactory, WalletApi } from './lib/wallet'
import { keyApiFactory, keyModuleFactory, KeyApi, KeyModule } from './lib/key'
import { UserApi, userApiFactory } from './lib/user'
import { transfersApiFactory, TransfersApi } from './lib/transfers'
import { Currency } from "./types/domain";
import bitcoinOps from './lib/bitcoin'
import { BitcoinOperations } from './lib/bitcoin-operations';

export interface SakiewkaApi {
  user: UserApi,
  transfers: TransfersApi,
  [Currency.BTC]: SakiewkaCurrencyApi,
  [Currency.BTG]: SakiewkaCurrencyApi
}

export interface SakiewkaCurrencyApi {
  address: AddressApi,
  transaction: TransactionApi,
  wallet: WalletApi,
  key: KeyApi
}

/*
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
    key: key(Currency.BTC),
    webhooks: webhooks(Currency.BTC)
  },
  [Currency.BTG]: {
    address: address(Currency.BTG),
    transaction: transaction(Currency.BTG),
    wallet: wallet(Currency.BTG),
    key: key(Currency.BTG),
    webhooks: webhooks(Currency.BTG)
  }
}
 */

export const sakiewkaApi = (sakiewkaBackend: SakiewkaBackend, chainInfo: string): SakiewkaApi => {

  function createCurrencyApi(backendApi: SakiewkaBackend, currency: Currency): SakiewkaCurrencyApi {
    const operationsModule = bitcoinOps(currency, chainInfo)
    const keyApi = keyApiFactory(backendApi[currency])
    const keyModule = keyModuleFactory(operationsModule)
    const walletApi = walletApiFactory(backendApi[currency], keyModule)
    return {
      address: addressApiFactory(backendApi[currency]),
      transaction: transactionApiFactory(backendApi[currency], keyModule, operationsModule, walletApi),
      wallet: walletApi,
      key: keyApi
    };
  }

  return {
    user: userApiFactory(sakiewkaBackend.core),
    transfers: transfersApiFactory(sakiewkaBackend.core),
    [Currency.BTC]: createCurrencyApi(sakiewkaBackend, Currency.BTC),
    [Currency.BTG]: createCurrencyApi(sakiewkaBackend, Currency.BTG),
  }
}

export interface SakiewkaModule {
  transaction: TransactionModule,
  address: AddressModule,
  key: KeyModule,
  bitcoin: BitcoinOperations
}

export const sakiewkaModule = (currency: Currency, btcNetwork: string): SakiewkaModule => {
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
export { backendFactory, SakiewkaBackend }
