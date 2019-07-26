import { KeyType } from '../domain/key'

export interface GetKeyBackendResponse {
  id: string
  pubKey: string
  prvKey?: string
  keyType: KeyType
  created: string
}
