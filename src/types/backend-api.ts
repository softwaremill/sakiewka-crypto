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

export interface GetUnspentsBackendResponse {}

export interface GetKeyBackendResponse {}

export interface EthGetTransactionParamsResponse {
  gasLimit: string,
  gasPrice: string,
  nonce: number,
  contractNonce: number
}

export interface EthSendTransactionResponse {}
