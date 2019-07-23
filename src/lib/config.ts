import { SUPPORTED_NETWORKS } from './constants'
import { Currency } from '../types/domain'

export const networkFactory = (btcNetwork: string, currency: Currency) => {
  const network = SUPPORTED_NETWORKS[currency][btcNetwork]
  if (network == null) {
    throw new Error(`There is no network for ${currency} and ${btcNetwork}`)
  }
  return network
}
