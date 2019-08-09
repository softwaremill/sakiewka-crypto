import { AccountModule, accountModuleFactory } from './eos-account'
import { KeyModule, keyModuleFactory } from './eos-key'

export interface SakiewkaEosModule {
  account: AccountModule
  key: KeyModule
}

export const eosModuleFactory = (chainId: string): SakiewkaEosModule => {
  return {
    account: accountModuleFactory(chainId),
    key: keyModuleFactory(),
  }
}
