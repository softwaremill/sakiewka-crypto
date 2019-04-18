import { expect, use } from 'chai'

import { currency } from './helpers'
import * as backendApiFactory from '../backend-api'
import BigNumber from 'bignumber.js'
import chaiBigNumber from 'chai-bignumber'
import { webhooksApiFactory } from '../webhooks'

const backendApi = backendApiFactory.withCurrency('http://backendApiUrl', currency)

const webhooksApi = webhooksApiFactory(backendApi)

beforeEach(() => {
  use(chaiBigNumber(BigNumber))
})

describe('createWebhook', () => {
  it('should exist', () => {
    expect(webhooksApi.createWebhook).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => ({}))
    // @ts-ignore
    backendApi.createWebhook = mockImplementation

    const res = await webhooksApi.createWebhook(
      'testToken',
      'testWalletId',
      'http://test.callback.com',
      {}
    )

    const [token, walletId, callbackUrl, settings] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('testWalletId')
    expect(callbackUrl).to.eq('http://test.callback.com')
    expect(settings).to.be.a('object').that.is.empty
    expect(res).to.be.a('object').that.is.empty
  })
})
