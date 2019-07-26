export type TransactionHash = string

export type SendBackendResponse = TransactionHash

export interface EthGetTransactionParamsBackendResponse {
  contractNonce: string
  currentBlock: string
}

export interface SendETHBackendResponse {
  tx: string
}

export interface SendTokensBackendResponse {
  tx: string
}
