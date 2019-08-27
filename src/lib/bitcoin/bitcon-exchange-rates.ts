import { BitcoinBackendApi } from './bitcoin-backend-api'
import { GetExchangeRatesResponse } from 'response/exchangeRates'
import { FiatCurrency } from 'domain/exchangeRates'

export interface ExchangeRatesApi {
  getExchangeRates(
    fiatCurrency: FiatCurrency,
    fromDate: string,
    toDate: string,
  ): Promise<GetExchangeRatesResponse>
}

export const exchangeRatesApiFactory = (
  backendApi: BitcoinBackendApi,
): ExchangeRatesApi => {
  const getExchangeRates = (
    fiatCurrency: FiatCurrency,
    fromDate: string,
    toDate: string,
  ): Promise<GetExchangeRatesResponse> =>
    backendApi.getExchangeRates(fiatCurrency, fromDate, toDate)
  return { getExchangeRates }
}
