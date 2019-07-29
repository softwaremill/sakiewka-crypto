export interface KeyPair {
  pubKey: string
  prvKey?: string
}

export interface Key {
  id: string
  pubKey: string
  type: KeyType
}

export enum KeyType {
  USER = 'user',
  SERVICE = 'service',
  BACKUP = 'backup',
}
