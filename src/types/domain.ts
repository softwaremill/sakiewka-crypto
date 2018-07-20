export interface WalletParams {
  password: string
}

export interface Keychain {
  xpub: string,
  label: string
  xprv?: string,
  encryptedXprv?: string
}

export interface UTXO {
  txId: string,
  index: number,
  amount: number,
  scriptSig?: string
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
  keychains: Keychain[],
  addresses?: WalletAddresses,
  unspents: UTXO[]
}

export interface SendCoinsParams {
  walletId: number,
  walletPassphrase: string,
  destinationAddress: string,
  amount: number,
  xprv?: string
}
