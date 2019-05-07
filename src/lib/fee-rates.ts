import { CurrencyBackendApi } from './backend-api'
import { GetFeesRates } from 'response'

export interface FeeRatesApi {
  getFeeRate(): Promise<GetFeesRates>
}

export const feeRatesApiFactory = (backendApi: CurrencyBackendApi): FeeRatesApi => {
  const getFeeRate = (): Promise<GetFeesRates> => backendApi.getFeesRates()
  return { getFeeRate }
}
