import { Address, AddressBitcoin } from '../domain-types/address'

export interface PathBitcoin {
  cosignerIndex: string
  change: string
  addressIndex: string
}

export interface CreateNewAddressBackendResponse {
  address: string
}
export interface CreateNewBitcoinAddressBackendResponse extends CreateNewAddressBackendResponse {
  path: PathBitcoin
}

export interface GetAddressBackendResponse extends Address {}
export interface GetEosAddressBackendResponse extends GetAddressBackendResponse {}
export interface GetBitcoinAddressBackendResponse extends AddressBitcoin {}

export interface ListAddressesBackendResponse {
  addresses: Address[]
  nextPageToken?: string
}
export interface ListBitcoinAddressesBackendResponse extends ListAddressesBackendResponse {
  addresses: AddressBitcoin[]
}
export interface ListEosAddressesBackendResponse extends ListAddressesBackendResponse {}
