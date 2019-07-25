import {
  LoginBackendResponse,
  RegisterBackendResponse,
  SetupPasswordBackendResponse,
  InfoBackendResponse,
  Confirm2faBackendResponse,
  Disable2faBackendResponse,
  Init2faBackendResponse,
  BalanceBackendResponse,
  CreateAuthTokenBackendResponse,
  DeleteAuthTokenBackendResponse,
  AddSupportSubmissionBackendResponse,
} from '../api-types/user'

export interface LoginResponse extends LoginBackendResponse {}
export interface RegisterResponse extends RegisterBackendResponse {}
export interface SetupPasswordResponse extends SetupPasswordBackendResponse {}
export interface InfoResponse extends InfoBackendResponse {}
export interface Confirm2faResponse extends Confirm2faBackendResponse {}
export interface Disable2faResponse extends Disable2faBackendResponse {}
export interface Init2faResponse extends Init2faBackendResponse {}
export interface BalanceResponse extends BalanceBackendResponse {}
export interface CreateAuthTokenResponse
  extends CreateAuthTokenBackendResponse {}
export interface DeleteAuthTokenResponse
  extends DeleteAuthTokenBackendResponse {}
export interface AddSupportSubmissionResponse extends AddSupportSubmissionBackendResponse {}
