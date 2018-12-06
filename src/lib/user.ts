import {
  login as loginBackend,
  register as registerBackend,
  info as infoBackend
} from './backend-api'
import { hashPassword } from './crypto';

export const login = (login: string, password: string) => {
  return loginBackend(login, hashPassword(password))
}

export const register = (login: string, password: string) => {
  return registerBackend(login, hashPassword(password))
}

export const info = (token: string) => {
  return infoBackend(token)
}
