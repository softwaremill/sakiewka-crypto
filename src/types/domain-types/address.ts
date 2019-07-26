import { Path } from '../domain'

export interface Address {
  id: string
  name?: string
  address: string
  created: string
}

export interface AddressBitcoin extends Address {
  path: Path
}

export interface AddressEos extends Address {}
