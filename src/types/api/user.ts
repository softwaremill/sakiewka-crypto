import {
  LoginResponse,
  RegisterResponse,
  SetupPasswordResponse,
  InfoResponse,
  Confirm2faResponse,
  Disable2faResponse,
  Init2faResponse,
  BalanceResponse,
  CreateAuthTokenResponse,
  DeleteAuthTokenResponse,
  AddSupportSubmissionResponse,
} from '../response/user'

export type LoginBackendResponse = LoginResponse
export type RegisterBackendResponse = RegisterResponse
export type SetupPasswordBackendResponse = SetupPasswordResponse
export type InfoBackendResponse = InfoResponse
export type Confirm2faBackendResponse = Confirm2faResponse
export type Disable2faBackendResponse = Disable2faResponse
export type Init2faBackendResponse = Init2faResponse
export type BalanceBackendResponse = BalanceResponse
export type CreateAuthTokenBackendResponse = CreateAuthTokenResponse
export type DeleteAuthTokenBackendResponse = DeleteAuthTokenResponse
export type AddSupportSubmissionBackendResponse = AddSupportSubmissionResponse
