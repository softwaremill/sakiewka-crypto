import { Path, Key } from '../domain'
import { Wallet, WalletDetails } from '../domain-types/wallet'

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

export interface CreateWalletResponse extends CreateWalletBackendResponse {
  pdf: string
}

export interface GetWalletResponse extends GetWalletBackendResponse {}
export interface ListWalletsResponse extends ListWalletsBackendResponse {}
