import { AccountModule, accountModuleFactory } from './eos-account'
import { EosKeyModule, eosKeyModuleFactory } from './eos-key'

export interface SakiewkaEosModule {
  account: AccountModule
  key: EosKeyModule
}

export const eosModuleFactory = (chainId: string): SakiewkaEosModule => {
  return {
    account: accountModuleFactory(chainId),
    key: eosKeyModuleFactory(),
  }
}
