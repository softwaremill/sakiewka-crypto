import { expect, use } from 'chai'

import { currency } from './helpers'
import * as backendApiFactory from '../bitcoin/bitcoin-backend-api'
import BigNumber from 'bignumber.js'
import chaiBigNumber from 'chai-bignumber'
import { webhooksApiFactory } from '../webhooks'
import { createHttpClient } from '../utils/httpClient';

const backendApi = backendApiFactory.withCurrency('http://backendApiUrl', currency, createHttpClient(() => ''))

const webhooks = webhooksApiFactory(backendApi)

beforeEach(() => {
  use(chaiBigNumber(BigNumber))
})

describe('createWebhook', () => {
  it('should exist', () => {
    expect(webhooks.createWebhook).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => ({}))
    // @ts-ignore
    backendApi.createWebhook = mockImplementation

    const res = await webhooks.createWebhook(
      'testToken',
      'testWalletId',
      'http://test.callback.com',
      {
        'type': 'transfer'
      }
    )

    const [token, walletId, callbackUrl, settings] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('testWalletId')
    expect(callbackUrl).to.eq('http://test.callback.com')
    expect(settings).to.be.deep.eq({
      'type': 'transfer'
    })
    expect(res).to.be.a('object').that.is.empty
  })
})

describe('getWebhook', () => {
  it('should exist', () => {
    expect(webhooks.getWebhook).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => (
        {
          id: 'id123',
          walletId: 'walletId345',
          callbackUrl: 'http://test.callbackurl.com',
          settings: {
            type: 'transfer'
          }
        }
      )
    )
    // @ts-ignore
    backendApi.getWebhook = mockImplementation

    const res = await webhooks.getWebhook(
      'testToken',
      'testWalletId',
      'testWebhookId'
    )

    const [token, walletId, webhookId] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('testWalletId')
    expect(webhookId).to.eq('testWebhookId')
    expect(res).to.deep.eq({
      id: 'id123',
      walletId: 'walletId345',
      callbackUrl: 'http://test.callbackurl.com',
      settings: {
        type: 'transfer'
      }
    })
  })
})

describe('listWebhooks', () => {
  it('should exist', () => {
    expect(webhooks.listWebhooks).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => (
        [
          {
            id: 'id123',
            walletId: 'walletId345',
            callbackUrl: 'http://test.callbackurl.com',
            settings: {
              type: 'transfer'
            }
          }
        ]
      )
    )
    // @ts-ignore
    backendApi.listWebhooks = mockImplementation

    const res = await webhooks.listWebhooks(
      'testToken',
      'testWalletId',
      10,
      '4'
    )

    const [token, walletId, limit, nextPageToken] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('testWalletId')
    expect(limit).to.eq(10)
    expect(nextPageToken).to.eq('4')
    expect(res).to.deep.eq([
      {
        id: 'id123',
        walletId: 'walletId345',
        callbackUrl: 'http://test.callbackurl.com',
        settings: {
          type: 'transfer'
        }
      }
    ])
  })
})

describe('deleteWebhook', () => {
  it('should exist', () => {
    expect(webhooks.deleteWebhook).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => ({}))
    // @ts-ignore
    backendApi.deleteWebhook = mockImplementation

    const res = await webhooks.deleteWebhook(
      'testToken',
      'testWalletId',
      'testWebhookId'
    )

    const [token, walletId, webhookId] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('testWalletId')
    expect(webhookId).to.eq('testWebhookId')
    expect(res).to.be.a('object').that.is.empty
  })
})
