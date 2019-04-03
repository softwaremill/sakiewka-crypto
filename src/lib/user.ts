import { create } from './backend-api'
import { hashPassword } from './crypto';

export default (backendApiUrl: string) => {
  const backend = create(backendApiUrl)

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

