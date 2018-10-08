import { UTXO } from './domain'

export interface LoginBackendResponse {
  token: string
}

export interface RegisterBackendResponse {}

export interface InfoBackendResponse {}

export interface CreateWalletBackendParams {
  name: string,
  userPubKey: string,
  userPrvKey?: string,
  backupPubKey: string,
  backupPrvKey?: string
}

export interface CreateWalletBackendResponse {
  id: string,
  servicePubKey: string,
  initialAddress: {
    address: string,
    path: {}
  }
}

export interface GetWalletBackendResponse {
  pubKeys: any
}

export interface CreateNewAddressBackendResponse {
  address: string,
  path: {
    cosignerIndex: string,
    change: string,
    addressIndex: string
  }
}

export interface GetAddressBackendResponse {
  address: string,
  path: {
    cosignerIndex: string,
    change: string,
    addressIndex: string
  },
  name: string,
  created: string
}

export interface ListAddressesBackendResponse {}

export interface ListWalletsBackendResponse {}

export interface GetWalletBalanceBackendResponse {}

export interface ListUnspentsBackendResponse {
  data: {
    unspents: UTXO[]
  }
}

export interface GetKeyBackendResponse {}

// eth
export interface EthGetTransactionParamsResponse {
  contractNonce: string
}

export interface SendETHResponse {
  tx: string
}

export interface SendTokensResponse {
  tx: string
}
