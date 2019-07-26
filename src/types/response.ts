import { Policy, PolicySettings } from './domain'

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
