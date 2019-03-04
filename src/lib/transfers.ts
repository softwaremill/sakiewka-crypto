import {
  monthlySummary as monthlySummaryBackend,
  listTransfers as listTransfersBackend
} from './backend-api'
import { ListTransfersBackendResponse, MontlySummaryBackendResponse } from '../types/response';

export const monthlySummary = (token: string, month: number, year: number, fiatCurrency: number) : Promise<MontlySummaryBackendResponse> => {
  return monthlySummaryBackend(token, month, year, fiatCurrency)
}

export const listTransfers =  async (token: string,
                                     walletId: string,
                                     limit: number,
                                     nextPageToken?: string): Promise<ListTransfersBackendResponse> => {
  return listTransfersBackend(token,walletId,limit,nextPageToken)
}
