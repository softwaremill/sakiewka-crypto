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
