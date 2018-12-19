import { SUPPORTED_NETWORKS } from './constants'

export const network = SUPPORTED_NETWORKS[process.env.BTC_NETWORK] || SUPPORTED_NETWORKS.bitcoin
