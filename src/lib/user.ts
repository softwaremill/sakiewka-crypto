import {
  login as loginBackend,
  register as registerBackend,
  info as infoBackend
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

}

export const confirm2fa = (password: string, code: number) => {

}

export const disable2fa = (password: string, code: number) => {

}

// TODO-darek: add init2fa, confirm2fa, disable2fa
