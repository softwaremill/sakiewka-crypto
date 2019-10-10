import { EosWalletApi, walletApiFactory } from './eos-wallet'
import { EosBackendApi } from './eos-backend-api'
import {
  EosTransactionApi,
  eosTransactionApiFactory,
  eosTransactionModuleFactory,
} from './eos-transaction'
import { eosKeyModuleFactory } from './eos-key'
import { AccountFeeApi, accountFeeApiFactory } from "./eos-account-fee"

export interface SakiewkaEosApi {
  wallet: EosWalletApi
  transaction: EosTransactionApi,
  accountFee: AccountFeeApi
}

export const eosApiFactory = (
  backend: EosBackendApi,
  chainId: string,
): SakiewkaEosApi => {
  const keyModule = eosKeyModuleFactory()
  const transactionModule = eosTransactionModuleFactory(chainId)
  return {
    wallet: walletApiFactory(backend, keyModule),
    transaction: eosTransactionApiFactory(backend, keyModule, transactionModule),
    accountFee: accountFeeApiFactory(backend)
  }
}

export { EosWalletApi, EosTransactionApi }
