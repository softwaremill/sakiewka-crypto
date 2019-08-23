import {
  TransactionModule,
  transactionModuleFactory,
} from './bitcoin-transaction'
import { AddressModule, addressModuleFactory } from './bitcoin-address'
import { KeyModule, keyModuleFactory } from './bitcoin-key'
import { BitcoinOperations } from './bitcoin-operations'
import { Currency } from './../../types/domain/currency'
import bitcoinOps from './../../lib/bitcoin/bitcoin'

export interface SakiewkaBitcoinModule {
  transaction: TransactionModule
  address: AddressModule
  key: KeyModule
  bitcoin: BitcoinOperations
}

export function bitcoinModuleFactory(
  currency: Currency.BTC | Currency.BTG,
  btcNetwork: string,
): SakiewkaBitcoinModule {
  const bitcoinOperations = bitcoinOps(currency, btcNetwork)
  const keyModule = keyModuleFactory(bitcoinOperations)
  const transactionModule = transactionModuleFactory(
    keyModule,
    bitcoinOperations,
  )
  const addressModule = addressModuleFactory(bitcoinOperations, keyModule)
  return {
    transaction: transactionModule,
    address: addressModule,
    key: keyModule,
    bitcoin: bitcoinOperations,
  }
}
