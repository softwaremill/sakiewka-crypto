import { Policy, PolicyWalletData } from '../domain/policy'
import { NextPageToken } from '../domain/api'

export interface ListPoliciesForWalletResponse {
  policies: Policy[]
}

export interface CreatePolicyResponse {
  policy: Policy
}

export interface PolicyCreatedResponse {
  policy: Policy
}

export interface ListPoliciesResponse {
  policies: Policy[]
  nextPageToken?: NextPageToken
}

export interface AssignPolicyResponse {}

export interface ListWalletsForPolicyResponse {
  wallets: PolicyWalletData[]
}
