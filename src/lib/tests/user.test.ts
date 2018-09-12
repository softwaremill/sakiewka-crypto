import { expect } from 'chai'

import * as user from '../user'
import * as request from '../utils/request'

// @ts-ignore
const mockImplementation = jest.fn(() => ({ data: 'testToken' }))
request.default = mockImplementation

beforeEach(() => {
  // @ts-ignore
  mockImplementation.mockClear()
})

describe('login', () => {
  it('should exist', () => {
    expect(user.login).to.be.a('function')
  })

  it('should send proper request', async () => {
    process.env.BACKEND_API_URL = 'backurl'
    await user.login('a', 'b')

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq('backurl/api/v1/user/login')
    expect(params.method).to.eq('POST')
    expect(reqBody.email).to.eq('a')
    expect(reqBody.password).to.eq('b')
  })
})

describe('register', () => {
  it('should exist', () => {
    expect(user.register).to.be.a('function')
  })

  it('should send proper request', async () => {
    process.env.BACKEND_API_URL = 'backurl'
    await user.register('a', 'b')

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq('backurl/api/v1/user/register')
    expect(params.method).to.eq('POST')
    expect(reqBody.email).to.eq('a')
    expect(reqBody.password).to.eq('b')
  })
})

describe('info', () => {
  it('should exist', () => {
    expect(user.info).to.be.a('function')
  })

  it('should send proper request', async () => {
    process.env.BACKEND_API_URL = 'backurl'
    await user.info('testToken')

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq('backurl/api/v1/user/info')
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})
