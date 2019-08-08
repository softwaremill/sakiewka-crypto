import * as constants from './lib/constants'
import {
  AddressApi,
  addressApiFactory,
  AddressModule,
  addressModuleFactory,
} from './lib/bitcoin/bitcoin-address'
import * as crypto from './lib/crypto'
import { backendFactory, SakiewkaBackend } from './lib/backend-api'
import {
  TransactionApi,
  transactionApiFactory,
  TransactionModule,
  transactionModuleFactory,
} from './lib/bitcoin/bitcoin-transaction'
import { WalletApi, walletApiFactory } from './lib/bitcoin/bitcoin-wallet'
import {
  KeyApi,
  keyApiFactory,
  KeyModule,
  keyModuleFactory,
} from './lib/bitcoin/bitcoin-key'
import { UserApi, userApiFactory } from './lib/user'
import {
  TransfersApi,
  transfersApiFactory,
  chainTransfersApiFactory,
  ChainTransfersApi,
} from './lib/transfers'
import { Currency } from './types/domain/currency'
import bitcoinOps from './lib/bitcoin/bitcoin'
import { BitcoinOperations } from './lib/bitcoin/bitcoin-operations'
import { WebhooksApi, webhooksApiFactory } from './lib/webhooks'
import { policyApiFactory, PolicyApi } from './lib/policies'
import {
  feeRatesApiFactory,
  FeeRatesApi,
} from './lib/bitcoin/bitcoin-fee-rates'
import {
  eosModuleFactory,
  SakiewkaEosModule,
} from './lib/eos/eos-currency-module'
import {
  eosApiFactory,
  SakiewkaEosCurrencyApi,
} from './lib/eos/eos-currency-api'

type SakiewkaCurrencyApis = {
  [Currency.BTC]: SakiewkaCurrencyApi;
  [Currency.BTG]: SakiewkaCurrencyApi;
  [Currency.EOS]: SakiewkaEosCurrencyApi;
}

export interface SakiewkaApi extends SakiewkaCurrencyApis {
  user: UserApi
  transfers: TransfersApi
}

export interface SakiewkaCurrencyApi {
  address: AddressApi
  transaction: TransactionApi
  wallet: WalletApi
  key: KeyApi
  webhooks: WebhooksApi
  policy: PolicyApi
  transfers: ChainTransfersApi
  feeRates: FeeRatesApi
}

export const sakiewkaApi = (
  sakiewkaBackend: SakiewkaBackend,
  chainInfo: string,
): SakiewkaApi => {
  function createBitcoinCurrencyApi(
    backendApi: SakiewkaBackend,
    currency: Currency.BTC | Currency.BTG,
  ): SakiewkaCurrencyApi {
    const operationsModule = bitcoinOps(currency, chainInfo)
    const keyApi = keyApiFactory(backendApi[currency])
    const keyModule = keyModuleFactory(operationsModule)
    const walletApi = walletApiFactory(backendApi[currency], keyModule)
    return {
      address: addressApiFactory(backendApi[currency]),
      transaction: transactionApiFactory(
        backendApi[currency],
        keyModule,
        operationsModule,
        walletApi,
      ),
      wallet: walletApi,
      key: keyApi,
      webhooks: webhooksApiFactory(backendApi[currency]),
      policy: policyApiFactory(backendApi[currency]),
      transfers: chainTransfersApiFactory(backendApi[currency]),
      feeRates: feeRatesApiFactory(backendApi[currency]),
    }
  }

  return {
    user: userApiFactory(sakiewkaBackend.core),
    transfers: transfersApiFactory(sakiewkaBackend.core),
    [Currency.BTC]: createBitcoinCurrencyApi(sakiewkaBackend, Currency.BTC),
    [Currency.BTG]: createBitcoinCurrencyApi(sakiewkaBackend, Currency.BTG),
    [Currency.EOS]: eosApiFactory(sakiewkaBackend[Currency.EOS]),
  }
}

export interface SakiewkaBitcoinModule {
  transaction: TransactionModule
  address: AddressModule
  key: KeyModule
  bitcoin: BitcoinOperations
}

type SakiewkaCurrencyModules = {
  [Currency.BTC]: (btcNetwork: String) => SakiewkaBitcoinModule;
  [Currency.BTG]: (btcNetwork: String) => SakiewkaBitcoinModule;
  [Currency.EOS]: SakiewkaEosModule;
}

export interface SakiewkaModule extends SakiewkaCurrencyModules {}

export const sakiewkaModule = (): SakiewkaModule => {
  function createBitcoinCurrencyModule(
    currency: Currency.BTC | Currency.BTG,
    btcNetwork: string,
  ): SakiewkaBitcoinModule {
    const bitcoinOperations = bitcoinOps(currency, btcNetwork)
    const keyModule = keyModuleFactory(bitcoinOperations)
    const transactionModule = transactionModuleFactory(
      keyModule,
      bitcoinOperations,
    )
    const addressModule = addressModuleFactory(bitcoinOperations, keyModule)
    return {
      transaction: transactionModule,
      address: addressModule,
      key: keyModule,
      bitcoin: bitcoinOperations,
    }
  }

  return {
    [Currency.BTC]: (btcNetwork: string) =>
      createBitcoinCurrencyModule(Currency.BTC, btcNetwork),
    [Currency.BTG]: (btcNetwork: string) =>
      createBitcoinCurrencyModule(Currency.BTG, btcNetwork),
    [Currency.EOS]: eosModuleFactory(),
  }
}

export * from './types/response/index'
export * from './types/domain/index'

export { constants }
export { crypto }
export { backendFactory, SakiewkaBackend }
