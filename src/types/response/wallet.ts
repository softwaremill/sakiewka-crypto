import { Path, UTXO } from '../domain/transaction'
import { Wallet, WalletDetails, Unspents } from '../domain/wallet'
import { Key } from '../domain/key'

export interface CreateWalletResponse {
  id: string
  keys: Key[]
  pdf: string
}
export interface CreateBitcoinWalletResponse extends CreateWalletResponse {
  servicePubKey: string
  initialAddress: {
    address: string;
    path: Path;
  }
}
export interface CreateEosWalletResponse extends CreateWalletResponse {}

export interface EditWalletResponse {}

export type GetWalletResponse = WalletDetails

export interface ListWalletsResponse {
  wallets: Wallet[]
  nextPageToken?: string
}

export type ListUnspentsResponse = Unspents

export interface MaxTransferAmountResponse {
  amount: string
}

export interface ListUtxosByAddressResponse {
  transfers: UTXO[]
  nextPageToken?: string
}
