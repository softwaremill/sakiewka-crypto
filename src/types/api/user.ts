import { BalanceDetails } from '../domain/balance'
import { UserInfo } from '../domain/user'

export interface LoginBackendResponse {
  token: string
}

export interface RegisterBackendResponse {}

export interface SetupPasswordBackendResponse {
  token: string
}

export type InfoBackendResponse = UserInfo

export interface Init2faBackendResponse {
  qrCodeUrl: string
  email: string
  secretKey: string
}

export interface Confirm2faBackendResponse {}

export interface Disable2faBackendResponse {}

export interface BalanceBackendResponse {
  balances: BalanceDetails[]
}

export interface CreateAuthTokenBackendResponse {
  token: string
}

export interface DeleteAuthTokenBackendResponse {}

export interface AddSupportSubmissionBackendResponse {}
