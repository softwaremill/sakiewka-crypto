import { BalanceDetails } from '../domain/balance'
import { UserInfo } from '../domain/user'

export interface LoginResponse {
  token: string
}

export interface RegisterResponse {}

export interface SetupPasswordResponse {
  token: string
}

export type InfoResponse = UserInfo

export interface Init2faResponse {
  qrCodeUrl: string
  email: string
  secretKey: string
}

export interface Confirm2faResponse {}

export interface Disable2faResponse {}

export interface BalanceResponse {
  balances: BalanceDetails[]
}

export interface CreateAuthTokenResponse {
  token: string
}

export interface DeleteAuthTokenResponse {}

export interface AddSupportSubmissionResponse {}
