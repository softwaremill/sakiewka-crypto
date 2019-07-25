import { Policy, PolicySettings } from './domain'

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
