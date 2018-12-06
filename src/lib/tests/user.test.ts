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
