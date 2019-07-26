import {
  CreateNewBitcoinAddressBackendResponse,
  CreateNewAddressBackendResponse,
  GetAddressBackendResponse,
  GetEosAddressBackendResponse,
  GetBitcoinAddressBackendResponse,
  ListAddressesBackendResponse,
  ListBitcoinAddressesBackendResponse,
  ListEosAddressesBackendResponse,
} from '../api/address'

export type CreateNewAddressResponse = CreateNewAddressBackendResponse
export type CreateNewBitcoinAddressResponse = CreateNewBitcoinAddressBackendResponse

export type GetAddressResponse = GetAddressBackendResponse
export type GetBitcoinAddressResponse = GetBitcoinAddressBackendResponse
export type GetEosAddressResponse = GetEosAddressBackendResponse

export type ListAddressesResponse = ListAddressesBackendResponse
export type ListBitcoinAddressesResponse = ListBitcoinAddressesBackendResponse
export type ListEosAddressesResponse = ListEosAddressesBackendResponse
