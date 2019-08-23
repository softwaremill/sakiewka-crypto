import {
  AddressApi,
  addressApiFactory,
} from './../../lib/bitcoin/bitcoin-address'
import { SakiewkaBackend } from './../../lib/backend-api'
import {
  TransactionApi,
  transactionApiFactory,
} from './../../lib/bitcoin/bitcoin-transaction'
import {
  BitcoinWalletApi,
  walletApiFactory,
} from './../../lib/bitcoin/bitcoin-wallet'
import {
  KeyApi,
  keyApiFactory,
  keyModuleFactory,
} from './../../lib/bitcoin/bitcoin-key'
import {
  chainTransfersApiFactory,
  ChainTransfersApi,
} from './../../lib/transfers'
import { Currency } from './../../types/domain/currency'
import { WebhooksApi, webhooksApiFactory } from './../../lib/webhooks'
import { policyApiFactory, PolicyApi } from './../../lib/policies'
import {
  feeRatesApiFactory,
  FeeRatesApi,
} from './../../lib/bitcoin/bitcoin-fee-rates'
import bitcoinOps from './../../lib/bitcoin/bitcoin'
import { ChainNetwork } from '../network'

export interface SakiewkaBitcoinApi {
  address: AddressApi
  transaction: TransactionApi
  wallet: BitcoinWalletApi
  key: KeyApi
  webhooks: WebhooksApi
  policy: PolicyApi
  transfers: ChainTransfersApi
  feeRates: FeeRatesApi
}

export function bitcoinApiFactory(
  backendApi: SakiewkaBackend,
  currency: Currency.BTC | Currency.BTG,
  network: ChainNetwork,
): SakiewkaBitcoinApi {
  const operationsModule = bitcoinOps(currency, network[currency])
  const keyApi = keyApiFactory(backendApi[currency])
  const keyModule = keyModuleFactory(operationsModule)
  const walletApi = walletApiFactory(backendApi[currency], keyModule)
  return {
    address: addressApiFactory(backendApi[currency]),
    transaction: transactionApiFactory(
      backendApi[currency],
      keyModule,
      operationsModule,
      walletApi,
    ),
    wallet: walletApi,
    key: keyApi,
    webhooks: webhooksApiFactory(backendApi[currency]),
    policy: policyApiFactory(backendApi[currency]),
    transfers: chainTransfersApiFactory(backendApi[currency]),
    feeRates: feeRatesApiFactory(backendApi[currency]),
  }
}
