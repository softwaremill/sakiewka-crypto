import { CoreBackendApi } from './backend-api'
import { hashPassword } from './crypto'
import { LoginBackendResponse, RegisterBackendResponse, SetupPasswordBackendResponse, Init2faBackendResponse, Confirm2faBackendResponse, Disable2faBackendResponse, InfoBackendResponse, BalanceBackendResponse, CreateAuthTokenBackendResponse, DeleteAuthTokenBackendResponse } from '../types/response'

export interface UserApi {
  login(login: string, password: string, code?: number): Promise<LoginBackendResponse>
  register(login: string): Promise<RegisterBackendResponse>
  setupPassword(token: string, password: string): Promise<SetupPasswordBackendResponse>
  init2fa(token: string, password: string): Promise<Init2faBackendResponse>
  confirm2fa(token: string, password: string, code: number): Promise<Confirm2faBackendResponse>
  disable2fa(token: string, password: string, code: number): Promise<Disable2faBackendResponse>
  info(token: string): Promise<InfoBackendResponse>
  balance(token: string, fiatCurrency: string): Promise<BalanceBackendResponse>
  createAuthToken(token: string, duration?: string, ip?: string, scope?: string[]): Promise<CreateAuthTokenBackendResponse>
  deleteAuthToken(token: string): Promise<DeleteAuthTokenBackendResponse>,
  addSupportSubmission(token:string, subject:string, content: string) : Promise<any>
}

export const userApiFactory = (backend: CoreBackendApi): UserApi => {

  const login = (login: string, password: string, code?: number) => {
    return backend.login(login, hashPassword(password), code)
  }

  const register = (login: string) => {
    return backend.register(login)
  }

  const setupPassword = (token: string, password: string) => {
    return backend.setupPassword(token, hashPassword(password))
  }

  const info = (token: string) => {
    return backend.info(token)
  }

  const init2fa = (token: string, password: string) => {
    return backend.init2fa(token, hashPassword(password))
  }

  const confirm2fa = (token: string, password: string, code: number) => {
    return backend.confirm2fa(token, hashPassword(password), code)
  }

  const disable2fa = (token: string, password: string, code: number) => {
    return backend.disable2fa(token, hashPassword(password), code)
  }

  const balance = (token: string, fiatCurrency: string) => {
    return backend.balance(token, fiatCurrency)
  }

  const createAuthToken = (token: string, duration?: string, ip?: string, scope?: string[]) => {
    return backend.createAuthToken(token, duration, ip, scope)
  }

  const deleteAuthToken = (token: string) => {
    return backend.deleteAuthToken(token)
  }

  const addSupportSubmission = (token:string, subject:string, content: string) => {
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
