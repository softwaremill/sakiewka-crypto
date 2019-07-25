import {
  CreateWalletBackendResponse,
  EditWalletBackendResponse,
  GetWalletBackendResponse,
  ListWalletsBackendResponse,
  ListUnspentsBackendResponse,
  MaxTransferAmountBackendResponse,
  ListPoliciesForWalletBackendResponse,
  ListUtxosByAddressBackendResponse,
} from '../api-types/wallet'

export interface CreateWalletResponse extends CreateWalletBackendResponse {
  pdf: string
}
export interface EditWalletResponse extends EditWalletBackendResponse {}

export interface GetWalletResponse extends GetWalletBackendResponse {}

export interface ListWalletsResponse extends ListWalletsBackendResponse {}

export interface ListUnspentsResponse extends ListUnspentsBackendResponse {}

export interface MaxTransferAmountResponse
  extends MaxTransferAmountBackendResponse {}

export interface ListPoliciesForWalletResponse
  extends ListPoliciesForWalletBackendResponse {}

export interface ListUtxosByAddressResponse
  extends ListUtxosByAddressBackendResponse {}
