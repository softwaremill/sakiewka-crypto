import { Network } from 'bitcoinjs-lib'
import { BigNumber } from 'bignumber.js'

export interface WalletParams {
  passphrase: string,
  name: string,
  userPubKey?: string,
  backupPubKey?: string
}

export interface KeyPair {
  pubKey: string,
  prvKey?: string
}

export interface Key {
  id: string,
  pubKey: string,
  type: KeyType
}

export enum KeyType {
  USER = 'user',
  SERVICE = 'service',
  BACKUP = 'backup'
}

export enum TransferType {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing',
  OUTGOING_EXTERNAL = 'outgoing_external'
}

export enum Currency {
  BTC = 'btc',
  BTG = 'btg'
}

export interface UTXO {
  txHash: string,
  n: number,
  amount?: BigNumber,
  path?: Path
}

export interface Recipient {
  address: string,
  amount: BigNumber
}

export interface DecodedTx {
  outputs: Recipient[],
  inputs: UTXO[]
}

export interface Path {
  cosignerIndex: number,
  change: number,
  addressIndex: number
}

export interface Signature {
  operationHash: string
  signature: string
  contractNonce: number
}

export interface TxOut {
  script: Buffer,
  value: BigNumber
}

export interface SupportedNetworks {
  btc: {
    mainnet: Network,
    testnet: Network,
    regtest: Network
  },
  btg: {
    mainnet: Network,
    testnet: Network,
    regtest: Network
  },
}

export interface PolicySettings {
  kind: PolicyKind
}

export enum PolicyKind {
  MaxDailyAmount = "maxDailyAmount",
  Whitelist = "whitelist"
}

export class DailyAmountPolicy implements PolicySettings {
  kind: PolicyKind = PolicyKind.MaxDailyAmount
  amount: string

  constructor(amount: string) {
    this.amount = amount
  }
}

export class WhitelistPolicy implements PolicySettings {
  kind: PolicyKind = PolicyKind.Whitelist
  addresses: string[]

  constructor(addresss: string[]) {
    this.addresses = addresss
  }
}

export interface Policy {
  id: string,
  created: string,
  settings: PolicySettings
}