import {
  CreateNewBitcoinAddressResponse,
  CreateNewAddressResponse,
  GetAddressResponse,
  GetEosAddressResponse,
  GetBitcoinAddressResponse,
  ListAddressesResponse,
  ListBitcoinAddressesResponse,
  ListEosAddressesResponse,
} from '../response/address'

export type CreateNewAddressBackendResponse = CreateNewAddressResponse
export type CreateNewBitcoinAddressBackendResponse = CreateNewBitcoinAddressResponse

export type GetAddressBackendResponse = GetAddressResponse
export type GetBitcoinAddressBackendResponse = GetBitcoinAddressResponse
export type GetEosAddressBackendResponse = GetEosAddressResponse

export type ListAddressesBackendResponse = ListAddressesResponse
export type ListBitcoinAddressesBackendResponse = ListBitcoinAddressesResponse
export type ListEosAddressesBackendResponse = ListEosAddressesResponse
