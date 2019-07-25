import { BitcoinBackendApi } from './bitcoin-backend-api'
import { GetFeeRatesResponse } from '../../types/response-types/feeRates'

export interface FeeRatesApi {
  getFeeRate(): Promise<GetFeeRatesResponse>
}

export const feeRatesApiFactory = (
  backendApi: BitcoinBackendApi,
): FeeRatesApi => {
  const getFeeRate = () => backendApi.getFeeRates()
  return { getFeeRate }
}
