import { Currency } from '../types/domain/currency'
export type ChainNetwork = { [C in Currency]: string }

export const networks = {
  testnet: {
    [Currency.BTC]: 'testnet',
    [Currency.BTG]: 'testnet',
    [Currency.EOS]:
      'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  } as ChainNetwork,
  mainnet: {
    [Currency.BTC]: 'testnet',
    [Currency.BTG]: 'testnet',
    [Currency.EOS]:
      'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473', // jungle testnet v2
  } as ChainNetwork,
  regtest: (eosChainId: string) =>
    ({
      [Currency.BTC]: 'testnet',
      [Currency.BTG]: 'testnet',
      [Currency.EOS]: eosChainId,
    } as ChainNetwork),
}
