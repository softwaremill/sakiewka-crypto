import { expect, use } from 'chai'

import { userApiFactory } from '../user'
import * as backendApiFactory from '../backend-api'
import chaiAsPromised from 'chai-as-promised'
import { hashPassword } from '../crypto'
import { createHttpClient } from '../utils/httpClient'
import { API_ERROR } from '../constants'

const api = backendApiFactory.create(
  'http://backendApiUrl',
  createHttpClient(() => ''),
)
const user = userApiFactory(api)

beforeEach(() => {
  use(chaiAsPromised)
})

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
    const res = await user.init2fa('testToken', password)

    const [tokenArg, passwordArg] = mockImplementation.mock.calls[0]
    expect(tokenArg).to.eq('testToken')
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
    const res = await user.confirm2fa('testToken', password, code)

    const [tokenArg, passwordArg, codeArg] = mockImplementation.mock.calls[0]
    expect(tokenArg).to.eq('testToken')
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
    const res = await user.disable2fa('testToken', password, code)

    const [tokenArg, passwordArg, codeArg] = mockImplementation.mock.calls[0]
    expect(tokenArg).to.eq('testToken')
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

    const res = await user.register('a')

    const [loginArg] = mockImplementation.mock.calls[0]
    expect(loginArg).to.eq('a')
    expect(res).to.eq('backend response')
  })
})

describe('setupPassword', () => {
  it('should exist', () => {
    expect(user.register).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    api.setupPassword = mockImplementation

    const password = 'bbbbbbbbb'
    const res = await user.setupPassword('testToken', password)

    const [tokenArg, passwordArg] = mockImplementation.mock.calls[0]
    expect(tokenArg).to.eq('testToken')
    expect(passwordArg).to.eq(hashPassword(password))
    expect(res).to.eq('backend response')
  })

  it('should fail if password is too short', async () => {
    const password = 'b'
    const promise = user.setupPassword('testToken', password)
    await expect(promise)
      .to.eventually.be.rejected.and.have.property('errors')
      .that.deep.include(API_ERROR.PASSWORD_TOO_SHORT(8).errors[0])
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

describe('balance', () => {
  it('should exist', () => {
    expect(user.register).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    user.balance = mockImplementation

    const currency = 'USD'
    const res = await user.balance('testToken', currency)
    const [token, fiatCurrency] = mockImplementation.mock.calls[0]

    expect(token).to.eq('testToken')
    expect(fiatCurrency).to.eq(currency)
    expect(res).to.eq('backend response')
  })
})

describe('createAuthToken', () => {
  it('should exist', () => {
    expect(user.createAuthToken).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    user.createAuthToken = mockImplementation

    const res = await user.createAuthToken('testToken', '1 minute', '0.0.0.0', [
      'all',
    ])
    const [token, duration, ip, scope] = mockImplementation.mock.calls[0]

    expect(token).to.eq('testToken')
    expect(duration).to.eq('1 minute')
    expect(ip).to.eq('0.0.0.0')
    expect(scope).to.eql(['all'])
    expect(res).to.eq('backend response')
  })
})

describe('userSupport', () => {
  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    api.addUserSupportSubmission = mockImplementation

    const res = await user.addSupportSubmission(
      'testToken',
      'subject',
      'content',
    )

    const [token, subject, content] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(subject).to.eq('subject')
    expect(content).to.eq('content')
    expect(res).to.eq('backend response')
  })
})
