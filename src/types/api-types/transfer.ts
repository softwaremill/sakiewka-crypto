import {
  Transfer,
  TransferDetails,
  MonthlySummary,
} from '../domain-types/transfer'

export interface ListTransfersBackendResponse {
  transfers: Transfer[]
  nextPageToken?: string
}

export type FindTransferByTxHashBackendResponse = TransferDetails

export interface MonthlySummaryBackendResponse {
  chains: MonthlySummary[]
}
