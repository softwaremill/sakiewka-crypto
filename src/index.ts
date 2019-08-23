import * as constants from './lib/constants'
import * as crypto from './lib/crypto'
import { backendFactory, SakiewkaBackend } from './lib/backend-api'
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

export interface SakiewkaApi {
  user: UserApi
  transfers: TransfersApi
  [Currency.BTC]: SakiewkaBitcoinApi
  [Currency.BTG]: SakiewkaBitcoinApi
  [Currency.EOS]: SakiewkaEosApi
}

export const sakiewkaApi = (
  sakiewkaBackend: SakiewkaBackend,
  chainInfo: string,
): SakiewkaApi => {
  return {
    user: userApiFactory(sakiewkaBackend.core),
    transfers: transfersApiFactory(sakiewkaBackend.core),
    [Currency.BTC]: bitcoinApiFactory(sakiewkaBackend, Currency.BTC, chainInfo),
    [Currency.BTG]: bitcoinApiFactory(sakiewkaBackend, Currency.BTG, chainInfo),
    [Currency.EOS]: eosApiFactory(sakiewkaBackend[Currency.EOS], chainInfo),
  }
}

export interface SakiewkaModule {
  [Currency.BTC]: (btcNetwork: string) => SakiewkaBitcoinModule
  [Currency.BTG]: (btcNetwork: string) => SakiewkaBitcoinModule
  [Currency.EOS]: (chainId: string) => SakiewkaEosModule
}

export const sakiewkaModule = (): SakiewkaModule => {
  return {
    [Currency.BTC]: (btcNetwork: string) =>
      bitcoinModuleFactory(Currency.BTC, btcNetwork),
    [Currency.BTG]: (btcNetwork: string) =>
      bitcoinModuleFactory(Currency.BTG, btcNetwork),
    [Currency.EOS]: (chainId: string) => eosModuleFactory(chainId),
  }
}

export * from './types/response/index'
export * from './types/domain/index'

export { constants }
export { crypto }
export { backendFactory, SakiewkaBackend }
