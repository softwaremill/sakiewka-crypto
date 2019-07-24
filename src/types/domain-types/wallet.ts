import { Balance } from './balance'

export interface CreateWalletParams {
  passphrase: string
  name: string
  userPubKey?: string
  backupPubKey?: string
}

export interface Wallet {
  id: string
  name: string
  currency: string
  created: string
  balance: Balance
}
