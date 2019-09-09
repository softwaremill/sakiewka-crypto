import { Currency } from '../types/domain/currency'
export type ChainNetwork = { [C in Currency]: string }

export const networks = (eosChainId?: string) => ({
  mainnet: {
    [Currency.BTC]: 'mainnet',
    [Currency.BTG]: 'mainnet',
    [Currency.EOS]:
      eosChainId ||
      'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  } as ChainNetwork,
  testnet: {
    [Currency.BTC]: 'testnet',
    [Currency.BTG]: 'testnet',
    [Currency.EOS]:
      eosChainId ||
      'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473', // jungle testnet v2
  } as ChainNetwork,
  regtest: {
    [Currency.BTC]: 'regtest',
    [Currency.BTG]: 'regtest',
    [Currency.EOS]: eosChainId || '8be32650b763690b95b7d7e32d7637757a0a7392ad04f1c393872e525a2ce82b',
  } as ChainNetwork,
})
