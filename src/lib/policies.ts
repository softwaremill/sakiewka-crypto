import { PolicySettings } from '../types/domain/policy'
import {
  ListPoliciesResponse,
  ListWalletsForPolicyResponse,
  CreatePolicyResponse,
  AssignPolicyResponse,
} from '../types/response/policy'
import { BitcoinBackendApi } from './bitcoin/bitcoin-backend-api'

export interface PolicyApi {
  createPolicy(
    token: string,
    name: string,
    policy: PolicySettings,
  ): Promise<CreatePolicyResponse>
  listWalletsForPolicy(
    token: string,
    policyId: string,
  ): Promise<ListWalletsForPolicyResponse>
  listPolicies(
    token: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListPoliciesResponse>
  assignPolicy(
    token: string,
    policyId: string,
    walletId: string,
  ): Promise<AssignPolicyResponse>
}

export const policyApiFactory = (backendApi: BitcoinBackendApi): PolicyApi => {
  const createPolicy = (
    token: string,
    name: string,
    policySettings: PolicySettings,
  ): Promise<CreatePolicyResponse> =>
    backendApi.createPolicy(token, { name, settings: policySettings })

  const listWalletsForPolicy = (
    token: string,
    policyId: string,
  ): Promise<ListWalletsForPolicyResponse> =>
    backendApi.listWalletsForPolicy(token, policyId)

  const listPolicies = (
    token: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListPoliciesResponse> =>
    backendApi.listPolicies(token, limit, nextPageToken)

  const assignPolicy = (
    token: string,
    policyId: string,
    walletId: string,
  ): Promise<AssignPolicyResponse> =>
    backendApi.assignPolicy(token, policyId, { walletId })
  return {
    createPolicy,
    listPolicies,
    listWalletsForPolicy,
    assignPolicy,
  }
}
