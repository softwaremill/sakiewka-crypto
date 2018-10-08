import { expect } from 'chai'

import * as api from '../zlevator'
import * as request from '../utils/request'

// @ts-ignore
const mockImplementation = jest.fn(() => ({ data: 'testToken' }))
// @ts-ignore
request.default = mockImplementation

beforeEach(() => {
  // @ts-ignore
  mockImplementation.mockClear()
})

process.env.ZLEVATOR_URL = 'zlevator/api/v1.0'

describe('getNextNonce', () => {
  it('should exist', () => {
    expect(api.getNextNonce).to.be.a('function')
  })

  it('should send proper request', async () => {
    await api.getNextNonce()

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq('zlevator/api/v1.0/withdraw/new')
    expect(params.method).to.eq('GET')
  })
})

describe('sendETH', () => {
  it('should exist', () => {
    expect(api.sendETH).to.be.a('function')
  })

  it('should send proper request', async () => {
    await api.sendETH('addr', 111, 2451, '098', 'data', 'signature')

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq('zlevator/api/v1.0/withdraw/eth')
    expect(params.method).to.eq('POST')
    expect(reqBody.address).to.eq('addr')
    expect(reqBody.value).to.eq('111')
    expect(reqBody.expireTime).to.eq(2451)
    expect(reqBody.contractNonce).to.eq('098')
    expect(reqBody.signature).to.eq('signature')
  })
})

describe('sendTokens', () => {
  it('should exist', () => {
    expect(api.sendTokens).to.be.a('function')
  })

  it('should send proper request', async () => {
    await api.sendTokens('addr', 111, 2451, '098', 'signature', 'contract')

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq('zlevator/api/v1.0/withdraw/tokens')
    expect(params.method).to.eq('POST')
    expect(reqBody.address).to.eq('addr')
    expect(reqBody.value).to.eq('111')
    expect(reqBody.expireTime).to.eq(2451)
    expect(reqBody.contractNonce).to.eq('098')
    expect(reqBody.signature).to.eq('signature')
    expect(reqBody.contractAddress).to.eq('contract')
  })
})
