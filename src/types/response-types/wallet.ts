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

export type EditWalletResponse = EditWalletBackendResponse
export type GetWalletResponse = GetWalletBackendResponse
export type ListWalletsResponse = ListWalletsBackendResponse
export type ListUnspentsResponse = ListUnspentsBackendResponse
export type MaxTransferAmountResponse = MaxTransferAmountBackendResponse
export type ListPoliciesForWalletResponse = ListPoliciesForWalletBackendResponse
export type ListUtxosByAddressResponse = ListUtxosByAddressBackendResponse
