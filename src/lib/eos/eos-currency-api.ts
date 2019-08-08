import { WalletApi, walletApiFactory } from './eos-wallet'
import { EosBackendApi } from './eos-backend-api'
import { keyModuleFactory } from './eos-key'

export interface SakiewkaEosCurrencyApi {
  wallet: WalletApi
}

export const eosApiFactory = (
  backend: EosBackendApi,
): SakiewkaEosCurrencyApi => {
  return {
    wallet: walletApiFactory(backend, keyModuleFactory()),
  }
}
