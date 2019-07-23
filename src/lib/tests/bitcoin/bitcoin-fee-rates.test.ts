import { expect } from 'chai'

import { currency } from '../helpers'
import * as backendApiFactory from '../../bitcoin/bitcoin-backend-api'
import { feeRatesApiFactory } from '../../bitcoin/bitcoin-fee-rates'
import { createHttpClient } from '../../utils/httpClient'

const backendApi = backendApiFactory.withCurrency('http://backendApiUrl', currency, createHttpClient(() => ''))
// @ts-ignore
backendApi.getFeesRates = jest.fn(() => {
  return Promise.resolve({
    recommended: 123,
  })
})

describe('getKey', () => {
  const keyModule = feeRatesApiFactory(backendApi)
  it('should exist', () => {
    expect(keyModule.getFeeRate).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    const res = await keyModule.getFeeRate()
    expect(res.recommended).to.eq(123)
  })
})
