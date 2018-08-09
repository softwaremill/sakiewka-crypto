export interface LoginBackendResponse {
  token: string
}

export interface RegisterBackendResponse {}

export interface InfoBackendResponse {}

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

export interface ListWalletsBackendResponse {}

export interface EthGetTransactionParamsResponse {
  gasLimit: string,
  gasPrice: string,
  nonce: number,
  contractNonce: number
}

export interface EthSendTransactionResponse {}
