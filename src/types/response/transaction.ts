export type TransactionHash = string

export interface ServiceFeeData {
  amount: string
  serviceAddress: string
}

export interface GetServiceFeeResponse {
  fee?: ServiceFeeData
}

export type SendResponse = TransactionHash