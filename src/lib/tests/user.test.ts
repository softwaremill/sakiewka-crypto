import { expect } from 'chai'

import * as user from '../user'
import * as api from '../backend-api'
import { hashPassword } from '../crypto';

describe('login', () => {
  it('should exist', () => {
    expect(user.login).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    api.login = mockImplementation

    const password = 'b'
    const res = await user.login('a', password)

    const [loginArg, passwordArg] = mockImplementation.mock.calls[0]
    expect(loginArg).to.eq('a')
    expect(passwordArg).to.eq(hashPassword(password))
    expect(res).to.eq('backend response')
  })

  it('should pass proper arguments to backend-api method and return result of its call with 2fa code', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    api.login = mockImplementation

    const code = 123456
    const password = 'b'
    const res = await user.login('a', password, code)

    const [loginArg, passwordArg, codeArg] = mockImplementation.mock.calls[0]
    expect(loginArg).to.eq('a')
    expect(passwordArg).to.eq(hashPassword(password))
    expect(codeArg).to.eq(code)
    expect(res).to.eq('backend response')
  })
})

describe('init2fa', () => {
  it('should exist', () => {
    expect(user.init2fa).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    api.init2fa = mockImplementation

    const password = 'b'
    const res = await user.init2fa(password)

    const [passwordArg] = mockImplementation.mock.calls[0]
    expect(passwordArg).to.eq(hashPassword(password))
    expect(res).to.eq('backend response')
  })
})

describe('confirm2fa', () => {
  it('should exist', () => {
    expect(user.confirm2fa).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    api.confirm2fa = mockImplementation

    const code = 123456
    const password = 'b'
    const res = await user.confirm2fa(password, code)

    const [passwordArg, codeArg] = mockImplementation.mock.calls[0]
    expect(passwordArg).to.eq(hashPassword(password))
    expect(codeArg).to.eq(code)
    expect(res).to.eq('backend response')
  })
})

describe('disable2fa', () => {
  it('should exist', () => {
    expect(user.disable2fa).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    api.disable2fa = mockImplementation

    const code = 123456
    const password = 'b'
    const res = await user.disable2fa(password, code)

    const [passwordArg, codeArg] = mockImplementation.mock.calls[0]
    expect(passwordArg).to.eq(hashPassword(password))
    expect(codeArg).to.eq(code)
    expect(res).to.eq('backend response')
  })
})

describe('register', () => {
  it('should exist', () => {
    expect(user.register).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    api.register = mockImplementation

    const password = 'b'
    const res = await user.register('a', password)

    const [loginArg, passwordArg] = mockImplementation.mock.calls[0]
    expect(loginArg).to.eq('a')
    expect(passwordArg).to.eq(hashPassword(password))
    expect(res).to.eq('backend response')
  })
})

describe('info', () => {
  it('should exist', () => {
    expect(user.info).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    api.info = mockImplementation

    const res = await user.info('testToken')

    const [token] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(res).to.eq('backend response')
  })
})
