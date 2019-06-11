import { CoreBackendApi } from './backend-api'
import { BitcoinBackendApi } from './bitcoin/bitcoin-backend-api'
import { ListTransfersBackendResponse, MontlySummaryBackendResponse, TransferItemBackendResponse } from '../types/response';

export interface TransfersApi {
  monthlySummary(token: string, month: number, year: number, fiatCurrency: string): Promise<MontlySummaryBackendResponse>
  listTransfers(token: string, limit: number, nextPageToken?: string): Promise<ListTransfersBackendResponse>
}

export const transfersApiFactory = (backend: CoreBackendApi): TransfersApi => {

  const monthlySummary = (token: string, month: number, year: number, fiatCurrency: string): Promise<MontlySummaryBackendResponse> => {
    return backend.monthlySummary(token, month, year, fiatCurrency)
  }

  const listTransfers = (token: string, limit: number, nextPageToken?: string): Promise<ListTransfersBackendResponse> => {
    return backend.listTransfers(token, limit, nextPageToken)
  }

  return {
    monthlySummary,
    listTransfers
  }
}

export interface ChainTransfersApi {
  listTransfers(token: string, walletId: string, limit: number, nextPageToken?: string): Promise<ListTransfersBackendResponse>
  findTransferByTxHash(token: string, walletId: string, txHash: string): Promise<TransferItemBackendResponse>
}

export const chainTransfersApiFactory = (backend: BitcoinBackendApi): ChainTransfersApi => {

  const listTransfers = async (token: string, walletId: string, limit: number, nextPageToken?: string): Promise<ListTransfersBackendResponse> => {
    return backend.listTransfers(token, walletId, limit, nextPageToken)
  }

  const findTransferByTxHash = async (token: string, walletId: string, txHash: string): Promise<TransferItemBackendResponse> => {
    return backend.findTransferByTxHash(token, walletId, txHash)
  }

  return {
    listTransfers,
    findTransferByTxHash
  }
}