export interface LoginBackendResponse {
  token: string
}

export interface RegisterBackendResponse {}

export interface InfoBackendResponse {}

export interface CreateWalletBackendResponse {
  id: string
}

export interface GetWalletBackendResponse {
  pubKeys: any
}

export interface ListWalletsBackendResponse {}
