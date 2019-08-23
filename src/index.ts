import * as constants from './lib/constants'
import * as crypto from './lib/crypto'
import { SakiewkaBackend } from './lib/backend-api'
import { UserApi, userApiFactory } from './lib/user'
import { TransfersApi, transfersApiFactory } from './lib/transfers'
import { Currency } from './types/domain/currency'
import { eosModuleFactory, SakiewkaEosModule } from './lib/eos/eos-module'
import { eosApiFactory, SakiewkaEosApi } from './lib/eos/eos-api'
import {
  bitcoinModuleFactory,
  SakiewkaBitcoinModule,
} from './lib/bitcoin/bitcoin-module'
import {
  bitcoinApiFactory,
  SakiewkaBitcoinApi,
} from './lib/bitcoin/bitcoin-api'
import { ChainNetwork } from './lib/network'

export interface SakiewkaApi {
  user: UserApi
  transfers: TransfersApi
  [Currency.BTC]: SakiewkaBitcoinApi
  [Currency.BTG]: SakiewkaBitcoinApi
  [Currency.EOS]: SakiewkaEosApi
}

export const sakiewkaApiFactory = (
  sakiewkaBackend: SakiewkaBackend,
  network: ChainNetwork,
): SakiewkaApi => {
  return {
    user: userApiFactory(sakiewkaBackend.core),
    transfers: transfersApiFactory(sakiewkaBackend.core),
    [Currency.BTC]: bitcoinApiFactory(sakiewkaBackend, Currency.BTC, network),
    [Currency.BTG]: bitcoinApiFactory(sakiewkaBackend, Currency.BTG, network),
    [Currency.EOS]: eosApiFactory(
      sakiewkaBackend[Currency.EOS],
      network[Currency.EOS],
    ),
  }
}

export interface SakiewkaModule {
  [Currency.BTC]: SakiewkaBitcoinModule
  [Currency.BTG]: SakiewkaBitcoinModule
  [Currency.EOS]: SakiewkaEosModule
}

export const sakiewkaModuleFactory = (
  network: ChainNetwork,
): SakiewkaModule => {
  return {
    [Currency.BTC]: bitcoinModuleFactory(Currency.BTC, network[Currency.BTC]),
    [Currency.BTG]: bitcoinModuleFactory(Currency.BTG, network[Currency.BTG]),
    [Currency.EOS]: eosModuleFactory(network[Currency.EOS]),
  }
}

export * from './types/response/index'
export * from './types/domain/index'

export { constants }
export { crypto }
export * from './lib/backend-api'
export * from './lib/network'
export * from './lib/eos/eos-module'
export * from './lib/eos/eos-api'
export * from './lib/bitcoin/bitcoin-api'
export * from './lib/bitcoin/bitcoin-module'
