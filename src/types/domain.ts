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
  amount? : number,
  path?: Path
}

export interface Recipent {
  address: string,
  amount?: number
}

export interface DecodedTx {
  outputs: Recipent[],
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
  value : number
}