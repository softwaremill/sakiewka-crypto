import {
  confirm2fa as confirm2faBackend,
  disable2fa as disable2faBackend,
  info as infoBackend,
  init2fa as init2faBackend,
  login as loginBackend,
  register as registerBackend,
  verifyEmail as verifyEmailBackend,
  resendVerificationEmail as resendVerificationEmailBackend
} from './backend-api'
import { hashPassword } from './crypto';

export const login = (login: string, password: string, code?: number) => {
  return loginBackend(login, hashPassword(password), code)
}

export const register = (login: string, password: string) => {
  return registerBackend(login, hashPassword(password))
}

export const info = (token: string) => {
  return infoBackend(token)
}

export const init2fa = (token: string, password: string) => {
  return init2faBackend(token, hashPassword(password))
}

export const confirm2fa = (token: string, password: string, code: number) => {
  return confirm2faBackend(token, hashPassword(password), code)
}

export const disable2fa = (token: string, password: string, code: number) => {
  return disable2faBackend(token, hashPassword(password), code)
}

export const verifyEmail = (code: string, email: string) => {
  return verifyEmailBackend(code, email)
}

export const resendVerificationEmail = (email: string) => {
  return resendVerificationEmailBackend(email)
}