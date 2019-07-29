import {
  ListPoliciesResponse,
  ListPoliciesForWalletResponse,
  ListWalletsForPolicyResponse,
  CreatePolicyResponse,
  AssignPolicyResponse,
} from '../response/policy'
import { PolicySettings } from '../domain/policy'

export interface CreatePolicyBackendParams {
  name: string
  settings: PolicySettings
}

export interface AssignPolicyBackendParams {
  walletId: string
}

export type ListPoliciesBackendResponse = ListPoliciesResponse
export type ListPoliciesForWalletBackendResponse = ListPoliciesForWalletResponse
export type ListWalletsForPolicyBackendResponse = ListWalletsForPolicyResponse
export type CreatePolicyBackendResponse = CreatePolicyResponse
export type AssignPolicyBackendResponse = AssignPolicyResponse
