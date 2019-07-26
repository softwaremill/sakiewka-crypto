import { CoreBackendApi } from './backend-api'
import { BitcoinBackendApi } from './bitcoin/bitcoin-backend-api'
import {
  ListTransfersResponse,
  MonthlySummaryResponse,
  FindTransferByTxHashResponse,
} from '../types/response-types/transfer'

export interface TransfersApi {
  monthlySummary(
    token: string,
    month: number,
    year: number,
    fiatCurrency: string,
  ): Promise<MonthlySummaryResponse>
  listTransfers(
    token: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListTransfersResponse>
}

export const transfersApiFactory = (backend: CoreBackendApi): TransfersApi => {
  const monthlySummary = (
    token: string,
    month: number,
    year: number,
    fiatCurrency: string,
  ): Promise<MonthlySummaryResponse> => {
    return backend.monthlySummary(token, month, year, fiatCurrency)
  }

  const listTransfers = (
    token: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListTransfersResponse> => {
    return backend.listTransfers(token, limit, nextPageToken)
  }

  return {
    monthlySummary,
    listTransfers,
  }
}

export interface ChainTransfersApi {
  listTransfers(
    token: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListTransfersResponse>
  findTransferByTxHash(
    token: string,
    walletId: string,
    txHash: string,
  ): Promise<FindTransferByTxHashResponse>
}

export const chainTransfersApiFactory = (
  backend: BitcoinBackendApi,
): ChainTransfersApi => {
  const listTransfers = async (
    token: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListTransfersResponse> => {
    return backend.listTransfers(token, walletId, limit, nextPageToken)
  }

  const findTransferByTxHash = async (
    token: string,
    walletId: string,
    txHash: string,
  ): Promise<FindTransferByTxHashResponse> => {
    return backend.findTransferByTxHash(token, walletId, txHash)
  }

  return {
    listTransfers,
    findTransferByTxHash,
  }
}
