import { create } from './backend-api'
import { ListTransfersBackendResponse, MontlySummaryBackendResponse } from '../types/response';

export default (backendApiUrl: string) => {

  const backend = create(backendApiUrl)

  const monthlySummary = (token: string, month: number, year: number, fiatCurrency: number): Promise<MontlySummaryBackendResponse> => {
    return backend.monthlySummary(token, month, year, fiatCurrency)
  }

  const listTransfers = async (token: string,
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