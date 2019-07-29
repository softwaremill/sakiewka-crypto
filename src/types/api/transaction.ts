import { SendResponse } from '../response/transaction'

export interface SendETHBackendResponse {
  tx: string
}

export interface SendTokensBackendResponse {
  tx: string
}

export interface EthGetTransactionParamsBackendResponse {
  contractNonce: string
  currentBlock: string
}

export type SendBackendResponse = SendResponse
