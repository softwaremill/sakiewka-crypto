import { Address, AddressEos, AddressBitcoin } from '../domain/address'
import { NextPageToken } from '../domain/api'

interface PathBitcoin {
  cosignerIndex: string
  change: string
  addressIndex: string
}

export interface CreateNewAddressResponse {
  address: string
}
export interface CreateNewBitcoinAddressResponse
  extends CreateNewAddressResponse {
  path: PathBitcoin
}

export type GetAddressResponse = Address
export type GetEosAddressResponse = AddressEos
export type GetBitcoinAddressResponse = AddressBitcoin

export interface ListAddressesResponse {
  addresses: Address[]
  nextPageToken?: NextPageToken
}
export interface ListBitcoinAddressesResponse
  extends ListAddressesResponse {
  addresses: AddressBitcoin[]
}
export interface ListEosAddressesResponse
  extends ListAddressesResponse {
  addresses: AddressEos[]
}
