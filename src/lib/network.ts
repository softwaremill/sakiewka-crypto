import { Currency } from '../types/domain/currency'
export type ChainNetwork = { [C in Currency]: string }

export const networks = {
  testnet: {
    [Currency.BTC]: 'testnet',
    [Currency.BTG]: 'testnet',
    [Currency.EOS]: 'junble',
  } as ChainNetwork,
  mainnet: {
    [Currency.BTC]: 'testnet',
    [Currency.BTG]: 'testnet',
    [Currency.EOS]: 'junble',
  } as ChainNetwork,
  regtest: (eosChainId: string) =>
    ({
      [Currency.BTC]: 'testnet',
      [Currency.BTG]: 'testnet',
      [Currency.EOS]: eosChainId,
    } as ChainNetwork),
}
