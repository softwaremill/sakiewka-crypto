import { Address, AddressEos, AddressBitcoin } from '../domain-types/address'
import { NextPageToken } from '../domain-types/api'
export interface PathBitcoin {
  cosignerIndex: string
  change: string
  addressIndex: string
}

export interface CreateNewAddressBackendResponse {
  address: string
}
export interface CreateNewBitcoinAddressBackendResponse
  extends CreateNewAddressBackendResponse {
  path: PathBitcoin
}

export type GetAddressBackendResponse = Address
export type GetEosAddressBackendResponse = AddressEos
export type GetBitcoinAddressBackendResponse = AddressBitcoin

export interface ListAddressesBackendResponse {
  addresses: Address[]
  nextPageToken?: NextPageToken
}
export interface ListBitcoinAddressesBackendResponse
  extends ListAddressesBackendResponse {
  addresses: AddressBitcoin[]
}
export interface ListEosAddressesBackendResponse
  extends ListAddressesBackendResponse {
  addresses: AddressEos[]
}
