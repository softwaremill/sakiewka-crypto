import { BaseBackendApi } from './backend-api'
import { ListTransfersBackendResponse, MontlySummaryBackendResponse } from '../types/response';

export interface TransfersApi {
  monthlySummary(token: string, month: number, year: number, fiatCurrency: number): Promise<MontlySummaryBackendResponse>
  listTransfers(token: string, walletId: string, limit: number, nextPageToken?: string): Promise<ListTransfersBackendResponse>
}

export const transfersApiFactory = (backend: BaseBackendApi): TransfersApi => {

  const monthlySummary = (token: string, month: number, year: number, fiatCurrency: number): Promise<MontlySummaryBackendResponse> => {
    return backend.monthlySummary(token, month, year, fiatCurrency)
  }

  const listTransfers = (token: string,
    walletId: string,
    limit: number,
    nextPageToken?: string): Promise<ListTransfersBackendResponse> => {
    return backend.listTransfers(token, walletId, limit, nextPageToken)
  }

  return {
    monthlySummary,
    listTransfers
  }
}