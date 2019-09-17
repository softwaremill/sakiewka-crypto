import { BigNumber } from 'bignumber.js'
import { Balance } from './balance'
import { Currency } from './currency'
import { UTXO } from './transaction'
import { Key } from './key'

export interface CreateEosWalletParams extends CreateWalletParams {
  eosAccountName: string
}

export interface CreateWalletParams {
  passphrase: string
  name: string
  userPubKey?: string
  backupPubKey?: string
}

export interface Wallet {
  id: string
  name: string
  currency: Currency
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
