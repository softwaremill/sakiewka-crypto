import { EosWalletApi, walletApiFactory } from './eos-wallet'
import { EosBackendApi } from './eos-backend-api'
import {
  EosTransactionApi,
  eosTransactionApiFactory,
  eosTransactionModuleFactory,
} from './eos-transaction'
import { eosKeyModuleFactory } from './eos-key'
export interface SakiewkaEosCurrencyApi {
  wallet: EosWalletApi
  transaction: EosTransactionApi
}

export const eosApiFactory = (
  backend: EosBackendApi,
  chainId: string,
): SakiewkaEosCurrencyApi => {
  const keyModule = eosKeyModuleFactory()
  const transactionModule = eosTransactionModuleFactory(chainId)
  return {
    wallet: walletApiFactory(backend, keyModule),
    transaction: eosTransactionApiFactory(backend, keyModule, transactionModule),
  }
}
