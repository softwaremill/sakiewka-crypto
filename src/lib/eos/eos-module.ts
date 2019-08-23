import { AccountModule, accountModuleFactory } from './eos-account'
import { EosKeyModule, eosKeyModuleFactory } from './eos-key'
import {
  EosTransactionModule,
  eosTransactionModuleFactory,
} from './eos-transaction'

export interface SakiewkaEosModule {
  account: AccountModule
  key: EosKeyModule
  transaction: EosTransactionModule
}

export const eosModuleFactory = (chainId: string): SakiewkaEosModule => {
  return {
    account: accountModuleFactory(chainId),
    key: eosKeyModuleFactory(),
    transaction: eosTransactionModuleFactory(chainId),
  }
}
