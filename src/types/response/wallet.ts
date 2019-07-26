import {
  CreateWalletBackendResponse,
  EditWalletBackendResponse,
  GetWalletBackendResponse,
  ListWalletsBackendResponse,
  ListUnspentsBackendResponse,
  MaxTransferAmountBackendResponse,
  ListUtxosByAddressBackendResponse,
} from '../api/wallet'

export interface CreateWalletResponse extends CreateWalletBackendResponse {
  pdf: string
}

export type EditWalletResponse = EditWalletBackendResponse
export type GetWalletResponse = GetWalletBackendResponse
export type ListWalletsResponse = ListWalletsBackendResponse
export type ListUnspentsResponse = ListUnspentsBackendResponse
export type MaxTransferAmountResponse = MaxTransferAmountBackendResponse
export type ListUtxosByAddressResponse = ListUtxosByAddressBackendResponse
