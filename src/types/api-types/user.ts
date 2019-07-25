import { BalanceWithChain } from '../domain-types/balance'

export interface LoginBackendResponse {
  token: string
}

export interface RegisterBackendResponse {}

export interface SetupPasswordBackendResponse {
  token: string
}

export interface InfoBackendResponse {
  email: string
  token: string
  tokenInfo: {
    scope: string[];
    expiry: string;
  }
  twoFaEnabled: boolean
}

export interface Init2faBackendResponse {
  qrCodeUrl: string
  email: string
  secretKey: string
}

export interface Confirm2faBackendResponse {}

export interface Disable2faBackendResponse {}

export interface BalanceBackendResponse {
  balances: BalanceWithChain[]
}

export interface CreateAuthTokenBackendResponse {
  token: string
}

export interface DeleteAuthTokenBackendResponse {}

export interface AddSupportSubmissionBackendResponse {}
