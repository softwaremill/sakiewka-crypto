import { PolicySettings } from '../types/domain'
import { ListPoliciesResponse, ListWalletsForPolicyResponse } from 'response'
import { CurrencyBackendApi } from './backend-api';

export interface PolicyApi {
    createPolicy(token: string, name: string, policy: PolicySettings): Promise<any>
    listWalletsForPolicy(token: string, policyId: string): Promise<ListWalletsForPolicyResponse>
    listPolicies(token: string, limit: number, nextPageToken?: string): Promise<ListPoliciesResponse>
    assignPolicy(token: string, policyId: string, walletId: string): Promise<any>
}

export const policyApiFactory = (backendApi: CurrencyBackendApi): PolicyApi => {
    const createPolicy = (token: string, name: string, policySettings: PolicySettings): Promise<any> =>
        backendApi.createPolicy(token, { name, settings: policySettings })

    const listWalletsForPolicy = (token: string, policyId: string): Promise<ListWalletsForPolicyResponse> =>
        backendApi.listWalletsForPolicy(token, policyId)

    const listPolicies = (token: string, limit: number, nextPageToken?: string): Promise<ListPoliciesResponse> =>
        backendApi.listPolicies(token, limit, nextPageToken)

    const assignPolicy = (token: string, policyId: string, walletId: string): Promise<any> =>
        backendApi.assignPolicy(token, policyId, { walletId })
    return {
        createPolicy,
        listPolicies,
        listWalletsForPolicy,
        assignPolicy,
    }
}