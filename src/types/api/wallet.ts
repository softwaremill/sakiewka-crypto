import {
  EditWalletResponse,
  GetWalletResponse,
  ListWalletsResponse,
  ListUnspentsResponse,
  MaxTransferAmountResponse,
  ListUtxosByAddressResponse,
} from '../response/wallet'
import { Key } from '../domain/key'
import { Path } from '../domain/transaction'

export interface CreateEosWalletBackendParams
  extends CreateWalletBackendParams {
  firstAddressName: string
}

export interface CreateWalletBackendParams {
  name: string
  userPubKey: string
  userPrvKey?: string
  backupPubKey: string
  backupPrvKey?: string
}

export interface MaxTransferAmountBitcoinBackendParams {
  recipient: string
  feeRate: number
}
export interface MaxTransferAmountEosBackendParams {
  recipient: string
}

export interface GetUtxosBackendParams {
  feeRate?: number
  recipients: ReceipientBackend[]
}

export interface ReceipientBackend {
  address: string
  amount: string
}

export interface CreateWalletBackendResponse {
  id: string
  keys: Key[]
}
export interface CreateBitcoinWalletBackendResponse
  extends CreateWalletBackendResponse {
  servicePubKey: string
  initialAddress: {
    address: string;
    path: Path;
  }
}
export interface CreateEosWalletBackendResponse
  extends CreateWalletBackendResponse {}

export type EditWalletBackendResponse = EditWalletResponse
export type GetWalletBackendResponse = GetWalletResponse
export type ListWalletsBackendResponse = ListWalletsResponse
export type ListUnspentsBackendResponse = ListUnspentsResponse
export type MaxTransferAmountBackendResponse = MaxTransferAmountResponse
export type ListUtxosByAddressBackendResponse = ListUtxosByAddressResponse

export interface GetCurrentTxParamsResponse {
  irreversibleBlockNumber: number
  irreversibleBlockPrefix: number
  latestBlockTime: string
}
