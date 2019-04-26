import { PolicySettings } from '../types/domain'
import { WalletPoliciesResponse as ListPoliciesForWalletResponse, ListPoliciesResponse } from 'response'
import { CurrencyBackendApi } from './backend-api';

export interface PolicyApi {
    createPolicy(token: string, policy: PolicySettings): Promise<any>
    listPoliciesForWallet(token: string, walletId: string): Promise<ListPoliciesForWalletResponse>
    listPolicies(token: string, limit: number, nextPageToken?: string): Promise<ListPoliciesResponse>
    assignPolicy(token: string, policyId: string, walletId: string): Promise<any>
}

export const policyApiFactory = (backendApi: CurrencyBackendApi): PolicyApi => {
    const createPolicy = (token: string, policy: PolicySettings): Promise<any> =>
        backendApi.createPolicy(token, policy)

    const listPoliciesForWallet = (token: string, walletId: string): Promise<ListPoliciesForWalletResponse> =>
        backendApi.listPoliciesForWallet(token, walletId)

    const listPolicies = (token: string, limit: number, nextPageToken?: string): Promise<ListPoliciesResponse> =>
        backendApi.listPolicies(token, limit, nextPageToken)

    const assignPolicy = (token: string, policyId: string, walletId: string): Promise<any> =>
        backendApi.assignPolicy(token, policyId, { walletId })
    return {
        createPolicy,
        listPolicies,
        listPoliciesForWallet,
        assignPolicy,
    }
}