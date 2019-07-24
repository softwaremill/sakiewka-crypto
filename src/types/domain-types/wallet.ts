import { Balance } from './balance'
import { Key } from '../domain'

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

export interface WalletDetails extends Wallet {
  canSendFundsUsingPassword: boolean
  keys: Key[]
}
