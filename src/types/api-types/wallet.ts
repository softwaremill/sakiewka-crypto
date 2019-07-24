import { Path, Key } from '../domain'

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

export interface CreateWalletResponse extends CreateWalletBackendResponse {
  pdf: string
}
