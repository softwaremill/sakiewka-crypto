export interface WalletParams {
  passphrase: string,
  label: string,
  userPubKey?: string,
  backupPubKey?: string
}

export interface KeyPair {
  pubKey: string,
  prvKey?: string
}

export interface UTXO {
  txId: string,
  index: number,
  amount: number,
  path: string
}

export interface Recipent {
  address: string,
  amount: number
}

export interface SendCoinsParams {
  walletId: string,
  walletPassphrase: string,
  userToken: string,
  recipents: Recipent[],
  xprv?: string
}
