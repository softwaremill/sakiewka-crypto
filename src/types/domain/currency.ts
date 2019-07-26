import { Network } from 'bitcoinjs-lib'

export enum Currency {
  BTC = 'btc',
  BTG = 'btg',
  EOS = 'eos',
}

export interface SupportedNetworks {
  btc: {
    mainnet: Network;
    testnet: Network;
    regtest: Network;
  }
  btg: {
    mainnet: Network;
    testnet: Network;
    regtest: Network;
  }
}
