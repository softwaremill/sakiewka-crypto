import { BitcoinBackendApi } from './bitcoin-backend-api'
import { GetFeesRates } from 'response'

export interface FeeRatesApi {
  getFeeRate(): Promise<GetFeesRates>
}

export const feeRatesApiFactory = (backendApi: BitcoinBackendApi): FeeRatesApi => {
  const getFeeRate = (): Promise<GetFeesRates> => backendApi.getFeesRates()
  return { getFeeRate }
}
