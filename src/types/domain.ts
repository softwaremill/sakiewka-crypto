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

export interface UTXO {
  txHash: string,
  index: number,
  value?: number,
  path?: string
}

export interface Recipent {
  address: string,
  value: number
}

export interface DecodedTx {
  outputs: Recipent[],
  inputs: UTXO[]
}

export interface Signature {
  operationHash: string
  signature: string
  contractNonce: number
}
