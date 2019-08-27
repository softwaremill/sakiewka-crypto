import { ExchangeRate, FiatCurrency } from '../domain/exchangeRates'

export interface GetExchangeRatesResponse {
  fiatCurrency: FiatCurrency
  exchangeRates: ExchangeRate[]
}
