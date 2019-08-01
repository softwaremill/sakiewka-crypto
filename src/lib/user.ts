import { CoreBackendApi } from './backend-api'
import { hashPassword } from './crypto'
import {
  LoginResponse,
  RegisterResponse,
  SetupPasswordResponse,
  InfoResponse,
  Init2faResponse,
  Confirm2faResponse,
  Disable2faResponse,
  BalanceResponse,
  CreateAuthTokenResponse,
  DeleteAuthTokenResponse,
  AddSupportSubmissionResponse,
} from '../types/response/user'
import { API_ERROR } from './constants'

export interface UserApi {
  login(login: string, password: string, code?: number): Promise<LoginResponse>
  register(login: string): Promise<RegisterResponse>
  setupPassword(
    token: string,
    password: string,
  ): Promise<SetupPasswordResponse>
  init2fa(token: string, password: string): Promise<Init2faResponse>
  confirm2fa(
    token: string,
    password: string,
    code: number,
  ): Promise<Confirm2faResponse>
  disable2fa(
    token: string,
    password: string,
    code: number,
  ): Promise<Disable2faResponse>
  info(token: string): Promise<InfoResponse>
  balance(token: string, fiatCurrency: string): Promise<BalanceResponse>
  createAuthToken(
    token: string,
    duration?: string,
    ip?: string,
    scope?: string[],
  ): Promise<CreateAuthTokenResponse>
  deleteAuthToken(token: string): Promise<DeleteAuthTokenResponse>
  addSupportSubmission(
    token: string,
    subject: string,
    content: string,
  ): Promise<AddSupportSubmissionResponse>
}

export const userApiFactory = (backend: CoreBackendApi): UserApi => {
  const login = (
    login: string,
    password: string,
    code?: number,
  ): Promise<LoginResponse> => {
    return backend.login(login, hashPassword(password), code)
  }

  const register = (login: string): Promise<RegisterResponse> => {
    return backend.register(login)
  }

  const setupPassword = async (
    token: string,
    password: string,
  ): Promise<SetupPasswordResponse> => {
    const minPasswordLength = 8
    if (password.length < minPasswordLength) {
      throw API_ERROR.PASSWORD_TOO_SHORT(minPasswordLength)
    }
    return backend.setupPassword(token, hashPassword(password))
  }

  const info = (token: string): Promise<InfoResponse> => {
    return backend.info(token)
  }

  const init2fa = (
    token: string,
    password: string,
  ): Promise<Init2faResponse> => {
    return backend.init2fa(token, hashPassword(password))
  }

  const confirm2fa = (
    token: string,
    password: string,
    code: number,
  ): Promise<Confirm2faResponse> => {
    return backend.confirm2fa(token, hashPassword(password), code)
  }

  const disable2fa = (
    token: string,
    password: string,
    code: number,
  ): Promise<Disable2faResponse> => {
    return backend.disable2fa(token, hashPassword(password), code)
  }

  const balance = (
    token: string,
    fiatCurrency: string,
  ): Promise<BalanceResponse> => {
    return backend.balance(token, fiatCurrency)
  }

  const createAuthToken = (
    token: string,
    duration?: string,
    ip?: string,
    scope?: string[],
  ): Promise<CreateAuthTokenResponse> => {
    return backend.createAuthToken(token, duration, ip, scope)
  }

  const deleteAuthToken = (token: string): Promise<DeleteAuthTokenResponse> => {
    return backend.deleteAuthToken(token)
  }

  const addSupportSubmission = (
    token: string,
    subject: string,
    content: string,
  ): Promise<AddSupportSubmissionResponse> => {
    return backend.addUserSupportSubmission(token, subject, content)
  }

  return {
    login,
    register,
    setupPassword,
    info,
    init2fa,
    confirm2fa,
    disable2fa,
    balance,
    createAuthToken,
    deleteAuthToken,
    addSupportSubmission,
  }
}
