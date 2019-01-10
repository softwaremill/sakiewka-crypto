import { Network } from "bitcoinjs-lib";
import { BigNumber } from "bignumber.js";

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

export interface KeyType {
  User?: object,
  Service?: object,
  Backup?: object
}

export interface UTXO {
  txHash: string,
  n: number,
  amount? : BigNumber,
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
  value : BigNumber
}

export interface SupportedNetworks {
  bitcoin: Network,
  testnet: Network,
  regtest: Network
}