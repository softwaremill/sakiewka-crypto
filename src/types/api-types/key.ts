import { KeyType } from '../domain-types/key'

export interface GetKeyBackendResponse {
  id: string
  pubKey: string
  prvKey?: string
  keyType: KeyType
  created: string
}
