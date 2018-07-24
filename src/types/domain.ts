export interface WalletParams {
  passphrase: string,
  userPubKey?: string,
  backupPubKey?: string
}

export interface Keypair {
  pubKey: string,
  privKey?: string
}

export interface UTXO {
  txId: string,
  index: number,
  amount: number,
  path: string
}

export interface EncryptedKeychain {
  xpub: string,
  xprv: string,
  label: string
}

export interface Address {
  path: string,
  value: string
}

export interface WalletAddresses {
  change: Address[],
  receive: Address[]
}

export interface Wallet {
  id: number,
  pubKeys: string[],
  addresses?: WalletAddresses
}

export interface DetailedWallet {
  id: number,
  keychains: Keypair[],
  addresses?: WalletAddresses,
  unspents: UTXO[]
}

export interface SendCoinsParams {
  walletId: string,
  walletPassphrase: string,
  userToken: string,
  destinationAddress: string,
  amount: number,
  xprv?: string
}
