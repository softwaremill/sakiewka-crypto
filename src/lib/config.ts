import { BITCOIN_NETWORK, TESTNET_NETWORK } from './constants'

export const network = process.env.BTC_NETWORK === TESTNET_NETWORK ? TESTNET_NETWORK : BITCOIN_NETWORK
