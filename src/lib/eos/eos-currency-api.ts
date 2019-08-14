import { EosWalletApi, walletApiFactory } from './eos-wallet'
import { EosBackendApi } from './eos-backend-api'
import { EosKeyModule, eosKeyModuleFactory } from './eos-key'

export interface SakiewkaEosCurrencyApi {
  wallet: EosWalletApi
  key: EosKeyModule
}

export const eosApiFactory = (
  backend: EosBackendApi,
): SakiewkaEosCurrencyApi => {
  return {
    wallet: walletApiFactory(backend, eosKeyModuleFactory()),
    key: eosKeyModuleFactory()
  }
}
