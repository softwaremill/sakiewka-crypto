import { Path, Key } from '../domain'
import { Wallet, WalletDetails, Unspents } from '../domain-types/wallet'

export interface CreateWalletBackendParams {
  name: string
  userPubKey: string
  userPrvKey?: string
  backupPubKey: string
  backupPrvKey?: string
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

export interface GetWalletBackendResponse extends WalletDetails {}

export interface ListWalletsBackendResponse {
  wallets: Wallet[]
}

export interface ListUnspentsBackendResponse extends Unspents {}
