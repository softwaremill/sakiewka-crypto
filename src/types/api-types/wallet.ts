import { Path, Policy, UTXO } from '../domain'
import { Wallet, WalletDetails, Unspents } from '../domain-types/wallet'
import { Key } from '..//domain-types/key'

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

export interface EditWalletBackendResponse {}

export type GetWalletBackendResponse = WalletDetails

export interface ListWalletsBackendResponse {
  wallets: Wallet[]
  nextPageToken?: string
}

export type ListUnspentsBackendResponse = Unspents

export interface MaxTransferAmountBackendResponse {
  amount: string
}

export interface ListPoliciesForWalletBackendResponse {
  policies: Policy[]
}

export interface ListUtxosByAddressBackendResponse {
  transfers: UTXO[]
  nextPageToken?: string
}
