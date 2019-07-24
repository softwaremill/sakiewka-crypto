import {
  CreateWalletBackendResponse,
  GetWalletBackendResponse,
  ListWalletsBackendResponse,
  ListUnspentsBackendResponse,
} from '../api-types/wallet'

export interface CreateWalletResponse extends CreateWalletBackendResponse {
  pdf: string
}
export interface GetWalletResponse extends GetWalletBackendResponse {}
export interface ListWalletsResponse extends ListWalletsBackendResponse {}
export interface ListUnspentsResponse extends ListUnspentsBackendResponse {}
