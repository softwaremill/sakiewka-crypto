import {
  Transfer,
  TransferDetails,
  MonthlySummary,
} from '../domain-types/transfer'

export type ListTransfersBackendResponse = {
  transfers: Transfer[];
  nextPageToken?: string;
}

export type FindTransferByTxHashBackendResponse = TransferDetails

export interface MonthlySummaryBackendResponse {
  chains: MonthlySummary[]
}
