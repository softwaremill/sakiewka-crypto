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
})
