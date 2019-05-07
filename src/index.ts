import * as constants from './lib/constants'
import { AddressApi, addressApiFactory, AddressModule, addressModuleFactory } from './lib/address'
import * as crypto from './lib/crypto'
import { backendFactory, SakiewkaBackend } from './lib/backend-api'
import { TransactionApi, transactionApiFactory, TransactionModule, transactionModuleFactory } from './lib/transaction'
import { WalletApi, walletApiFactory } from './lib/wallet'
import { KeyApi, keyApiFactory, KeyModule, keyModuleFactory } from './lib/key'
import { UserApi, userApiFactory } from './lib/user'
import { TransfersApi, transfersApiFactory, chainTransfersApiFactory, ChainTransfersApi } from './lib/transfers'
import { Currency } from './types/domain'
import bitcoinOps from './lib/bitcoin'
import { BitcoinOperations } from './lib/bitcoin-operations'
import { WebhooksApi, webhooksApiFactory } from './lib/webhooks'
import { policyApiFactory, PolicyApi } from './lib/policies'
import { feeRatesApiFactory, FeeRatesApi } from './lib/fee-rates'

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
  key: KeyApi,
  webhooks: WebhooksApi,
  policy: PolicyApi,
  transfers: ChainTransfersApi,
  feeRates: FeeRatesApi,
}

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
      key: keyApi,
      webhooks: webhooksApiFactory(backendApi[currency]),
      policy: policyApiFactory(backendApi[currency]),
      transfers: chainTransfersApiFactory(backendApi[currency]),
      feeRates: feeRatesApiFactory(backendApi[currency])
    }
  }

  return {
    user: userApiFactory(sakiewkaBackend.core),
    transfers: transfersApiFactory(sakiewkaBackend.core),
    [Currency.BTC]: createCurrencyApi(sakiewkaBackend, Currency.BTC),
    [Currency.BTG]: createCurrencyApi(sakiewkaBackend, Currency.BTG)
  }
}

export interface SakiewkaModule {
  transaction: TransactionModule,
  address: AddressModule,
  key: KeyModule,
  bitcoin: BitcoinOperations
}

export const sakiewkaModule = (currency: Currency, btcNetwork: string): SakiewkaModule => {
  const bitcoinOperations = bitcoinOps(currency, btcNetwork)
  const keyModule = keyModuleFactory(bitcoinOperations)
  const transactionModule = transactionModuleFactory(keyModule, bitcoinOperations)
  const addressModule = addressModuleFactory(bitcoinOperations, keyModule)
  return {
    transaction: transactionModule,
    address: addressModule,
    key: keyModule,
    bitcoin: bitcoinOperations
  }
}

export { Currency } from './types/domain'
export { constants }
export { crypto }
export { backendFactory, SakiewkaBackend }
