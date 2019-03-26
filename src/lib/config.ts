import { SUPPORTED_NETWORKS } from './constants'

// @ts-ignore
export const network = SUPPORTED_NETWORKS[process.env.BTC_NETWORK] || SUPPORTED_NETWORKS.bitcoin
console.log(`*** SAKIEWKA-CRYPTO NETWORK IS SET TO ${JSON.stringify(network)}`)
