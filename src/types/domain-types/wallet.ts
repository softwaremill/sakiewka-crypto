import { BigNumber } from 'bignumber.js'
import { Balance } from './balance'
import { Key, UTXO } from '../domain'

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

export interface ServiceFee {
  amount: string
  address: string
}

export interface Unspents {
  outputs: UTXO[]
  amount: string
  change: string
  fee: string
  serviceFee?: ServiceFee
}

export interface Receipient {
  address: string
  amount: BigNumber
}
