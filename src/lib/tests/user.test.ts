import { expect } from 'chai'

import * as user from '../user'
import * as api from '../backend-api'

describe('login', () => {
  it('should exist', () => {
    expect(user.login).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    api.login = mockImplementation

    const res = await user.login('a', 'b')

    const [login, password] = mockImplementation.mock.calls[0]
    expect(login).to.eq('a')
    expect(password).to.eq('b')
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

    const res = await user.register('a', 'b')

    const [login, password] = mockImplementation.mock.calls[0]
    expect(login).to.eq('a')
    expect(password).to.eq('b')
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
