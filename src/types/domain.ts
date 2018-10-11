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
  path?: string,
  redeemScript?: string | Buffer
}

export interface Recipent {
  address: string,
  value: number
}

export interface SendCoinsParams {
  walletId: string,
  walletPassphrase: string,
  userToken: string,
  recipents: Recipent[],
  xprv?: string
}

export interface Signature {
  operationHash: string
  signature: string
  contractNonce: number
}
