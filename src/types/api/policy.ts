import { Policy, PolicySettings } from '../domain/policy'
import { NextPageToken } from '../domain/api'

export interface ListPoliciesForWalletBackendResponse {
  policies: Policy[]
}

export interface CreatePolicyBackendParams {
  name: string
  settings: PolicySettings
}

export interface CreatePolicyBackendResponse {
  policy: Policy
}

export interface PolicyCreatedBackendResponse {
  policy: Policy
}

export interface ListPoliciesBackendResponse {
  policies: Policy[]
  nextPageToken?: NextPageToken
}

export interface AssignPolicyBackendParams {
  walletId: string
}

export interface AssignPolicyBackendResponse {}

export interface PolicyWalletData {
  id: string
  name: string
  currency: string
  created: string
}

export interface ListWalletsForPolicyBackendResponse {
  wallets: PolicyWalletData[]
}
