import { EosAccountModule, eosAccountModuleFactory } from './eos-account'
import { EosKeyModule, eosKeyModuleFactory } from './eos-key'
import {
  EosTransactionModule,
  eosTransactionModuleFactory,
} from './eos-transaction'

export interface SakiewkaEosModule {
  account: EosAccountModule
  key: EosKeyModule
  transaction: EosTransactionModule
}

export const eosModuleFactory = (chainId: string): SakiewkaEosModule => {
  return {
    account: eosAccountModuleFactory(chainId),
    key: eosKeyModuleFactory(),
    transaction: eosTransactionModuleFactory(chainId),
  }
}

export { EosAccountModule, EosKeyModule, EosTransactionModule }
