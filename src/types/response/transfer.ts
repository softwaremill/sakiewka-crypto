import {
  Transfer,
  TransferDetails,
  MonthlySummary,
} from '../domain/transfer'

export type ListTransfersResponse = {
  transfers: Transfer[];
  nextPageToken?: string;
}

export type FindTransferByTxHashResponse = TransferDetails

export interface MonthlySummaryResponse {
  chains: MonthlySummary[]
}
