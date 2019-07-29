import { KeyType } from '../domain/key'

export interface GetKeyResponse {
  id: string
  pubKey: string
  prvKey?: string
  keyType: KeyType
  created: string
}
