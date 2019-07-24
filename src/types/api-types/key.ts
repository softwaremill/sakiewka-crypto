import { KeyType } from '../domain'

export interface GetKeyBackendResponse {
  id: string
  pubKey: string
  prvKey?: string
  keyType: KeyType
  created: string
}

export interface GetKeyResponse extends GetKeyBackendResponse {}
