export interface WalletParams {
  password: string
}

export interface Keychain {
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
