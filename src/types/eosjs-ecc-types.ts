export interface PublicKey {
  toString: () => string
}

export interface PrivateKey {
  randomKey: () => PrivateKey
  toString: () => string
  toPublic: () => PublicKey
  getChildKey: () => PublicKey
}