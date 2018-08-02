import {
  login as loginBackend,
  register as registerBackend,
  info as infoBackend
} from './backend-api'

export const login = (login: string, password: string) => {
  return loginBackend(login, password)
}

export const register = (login: string, password: string) => {
  return registerBackend(login, password)
}

export const info = (token: string) => {
  return infoBackend(token)
}
