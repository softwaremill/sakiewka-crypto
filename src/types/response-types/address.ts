import {
  CreateNewBitcoinAddressBackendResponse,
  CreateNewAddressBackendResponse,
  GetAddressBackendResponse,
  GetEosAddressBackendResponse,
  GetBitcoinAddressBackendResponse,
  ListAddressesBackendResponse,
  ListBitcoinAddressesBackendResponse,
  ListEosAddressesBackendResponse,
} from '../api-types/address'

export interface CreateNewAddressResponse
  extends CreateNewAddressBackendResponse {}
export interface CreateNewBitcoinAddressResponse
  extends CreateNewBitcoinAddressBackendResponse {}

export interface GetAddressResponse extends GetAddressBackendResponse {}
export interface GetBitcoinAddressResponse
  extends GetBitcoinAddressBackendResponse {}
export interface GetEosAddressResponse extends GetEosAddressBackendResponse {}

export interface ListAddressesResponse extends ListAddressesBackendResponse {}
export interface ListBitcoinAddressesResponse
  extends ListBitcoinAddressesBackendResponse {}
export interface ListEosAddressesResponse
  extends ListEosAddressesBackendResponse {}
