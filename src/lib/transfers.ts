import { BaseBackendApi } from './backend-api'
import { ListTransfersBackendResponse, MontlySummaryBackendResponse } from '../types/response';

export interface TransfersApi {
  monthlySummary(token: string, month: number, year: number, fiatCurrency: string): Promise<MontlySummaryBackendResponse>
  listTransfers(token: string, limit: number, nextPageToken?: string): Promise<ListTransfersBackendResponse>
}

export const transfersApiFactory = (backend: BaseBackendApi): TransfersApi => {

  const monthlySummary = (token: string, month: number, year: number, fiatCurrency: string): Promise<MontlySummaryBackendResponse> => {
    return backend.monthlySummary(token, month, year, fiatCurrency)
  }

  const listTransfers = (token: string,  limit: number, nextPageToken?: string): Promise<ListTransfersBackendResponse> => {
    return backend.listTransfers(token, limit, nextPageToken)
  }

  return {
    monthlySummary,
    listTransfers
  }
}