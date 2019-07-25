import { UTXO, Path, Policy, PolicySettings } from './domain'
import { Key } from './domain-types/key'

export interface MontlySummaryBackendResponse {
  spentBTC: string
  spentFiat: string
  serviceFeeBTC: string
  serviceFeeFiat: string
}

export interface ListTransfersBackendResponse {
  transfers: TransferItemBackendResponse[]
  nextPageToken?: string
}

export interface ListUtxosByAddressBackendResponse {
  transfers: UTXO[]
  nextPageToken?: string
}

export interface TransferItemBackendResponse {
  chain: string
  wallet: TransferItemWallet
  timestamp: string
  transaction: TransferItemTransaction
  block?: TransferItemBlock
}

export interface TransferItemWallet {}

export interface TransferItemBlock {}

export interface TransferItemTransaction {}

export interface GetUtxosBackendParams {
  feeRate?: number
  recipients: ReceipientsBackend[]
}

export interface ReceipientsBackend {
  address: string
  amount: string
}

interface WalletBackendResponse {
  id: string
  keys: Key[]
}

export interface CreateBitcoinWalletBackendResponse
  extends WalletBackendResponse {
  servicePubKey: string
  initialAddress: {
    address: string;
    path: Path;
  }
}

export interface CreateNewEosAddressBackendResponse {
  address: string
}

export interface GetEosAddressBackendResponse {
  address: string
  name: string
  created: string
}

export interface GetBitcoinAddressBackendResponse {
  address: string
  path: Path
  name: string
  created: string
}

export interface GetWebhooksResponse {
  id: string
  walletId: string
  callbackUrl: string
  settings: any
}

export interface ListWebhooksResponse {
  webhooks: GetWebhooksResponse[]
}

export interface DeleteWebhookResponse {}

export interface CreateWebhookResponse {
  id: string
}

export interface ServiceFee {
  amount: string
  address: string
}

// eth
export interface EthGetTransactionParamsResponse {
  contractNonce: string
  currentBlock: string
}

export interface SendETHResponse {
  tx: string
}

export interface SendTokensResponse {
  tx: string
}

export interface GetFeeRates {
  recommended: number
}

export interface ErrorResponse {
  errors: ErrorDetails[]
  code: number
}

export interface ErrorDetails {
  message: string
  code: string
}

export interface MaxTransferAmountEosParams {
  recipient: string
}

export interface MaxTransferAmountResponse {
  amount: string
}

export interface ChainInfoResponse {
  type: string
}

export interface ListPoliciesForWalletResponse {
  policies: Policy[]
}

export interface PolicyCreateRequest {
  name: string
  settings: PolicySettings
}

export interface PolicyCreatedResponse {
  policy: Policy
}

export interface ListPoliciesResponse {
  policies: Policy[]
  nextPageToken?: string
}

export interface AssignPolicyBackendParams {
  walletId: string
}

export interface ListWalletsForPolicyResponse {}
