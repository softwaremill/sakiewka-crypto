import { CoreBackendApi } from './backend-api'
import { hashPassword } from './crypto';
import { LoginBackendResponse, RegisterBackendResponse, SetupPasswordBackendResponse, Init2faBackendResponse, Confirm2faBackendResponse, Disable2faBackendResponse, InfoBackendResponse } from 'response';

export interface UserApi {
  login(login: string, password: string, code?: number): Promise<LoginBackendResponse>
  register(login: string): Promise<RegisterBackendResponse>
  setupPassword(token: string, password: string): Promise<SetupPasswordBackendResponse>
  init2fa(token: string, password: string): Promise<Init2faBackendResponse>
  confirm2fa(token: string, password: string, code: number): Promise<Confirm2faBackendResponse>
  disable2fa(token: string, password: string, code: number): Promise<Disable2faBackendResponse>
  info(token: string): Promise<InfoBackendResponse>
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

  return {
    login,
    register,
    setupPassword,
    info,
    init2fa,
    confirm2fa,
    disable2fa
  }
}
