import { BITCOIN_NETWORK, TESTNET_NETWORK } from './constants'
import { networks } from 'bitcoinjs-lib'

export const network = networks[process.env.BTC_NETWORK] || networks.bitcoin
