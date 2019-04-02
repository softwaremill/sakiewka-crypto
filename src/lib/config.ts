import { SUPPORTED_NETWORKS } from './constants'
import { Currency } from '../types/domain';

export const networkFactory = (currency : Currency) => {
  const envNetwork = (process.env.BTC_NETWORK || 'mainnet').toLowerCase();
  const network = SUPPORTED_NETWORKS[currency][envNetwork];
  if(network == null) {
    throw new Error(`There is no network for ${currency} and ${envNetwork}`)
  }
  return network
}
