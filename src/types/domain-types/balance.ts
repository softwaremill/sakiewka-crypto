import { Currency } from './currency'

export interface Balance {
  available: string
  locked: string
  total: string
  totalInFiat: string
  fiatCurrency: string
}

export interface BalanceWithChain extends Balance {
  chain: Currency
}
