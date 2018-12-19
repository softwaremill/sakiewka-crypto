import {
  confirm2fa as confirm2faBackend,
  disable2fa as disable2faBackend,
  info as infoBackend,
  init2fa as init2faBackend,
  login as loginBackend,
  register as registerBackend
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

export const init2fa = (password: string) => {
  return init2faBackend(password)
}

export const confirm2fa = (password: string, code: number) => {
  return confirm2faBackend(password, code)
}

export const disable2fa = (password: string, code: number) => {
  return disable2faBackend(password, code)
}
