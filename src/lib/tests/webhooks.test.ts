import { use } from 'chai'

import { currency } from './helpers'
import * as backendApiFactory from '../backend-api'
import BigNumber from 'bignumber.js'
import chaiBigNumber from 'chai-bignumber'
import bitcoinFactory from '../bitcoin'
import { webhooksApiFactory } from '../webhooks'

const backendApi = backendApiFactory.withCurrency('http://backendApiUrl', currency)

const bitcoinOperation = bitcoinFactory(currency, 'mainnet')
const webhooksApi = webhooksApiFactory(backendApi)

beforeEach(() => {
  use(chaiBigNumber(BigNumber))
})

describe('createWebhook', () => {
  // TODO-Darek: write specs
})
