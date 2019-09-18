import { expect } from 'chai'

import * as backendApiFactory from '../../bitcoin/bitcoin-backend-api'
import { createHttpClient } from '../../utils/httpClient'
import { exchangeRatesApiFactory } from '../../bitcoin/bitcon-exchange-rates'
import { forBTCandBTG } from '../../utils/helpers'

forBTCandBTG('bitcoin exchange rates', currency => {

  const backendApi = backendApiFactory.withCurrency(
    'http://backendApiUrl',
    currency,
    createHttpClient(() => ''),
  )

// @ts-ignore
  backendApi.getExchangeRates = jest.fn(() => {
    return Promise.resolve({
      fiatCurrency: 'USD',
      exchangeRates: [
        {
          date: '2019-08-26',
          rate: '10137.745',
        },
        {
          date: '2019-08-27',
          rate: '10363.715',
        },
      ],
    })
  })

  describe('getExchangeRates', () => {
    const keyModule = exchangeRatesApiFactory(backendApi)
    it('should exist', () => {
      expect(keyModule.getExchangeRates).to.be.a('function')
    })

    it('should pass proper arguments to backend-api and return result', async () => {
      const res = await keyModule.getExchangeRates(
        'USD',
        '2019-08-26',
        '2019-08-27',
      )
      expect(res.fiatCurrency).to.eq('USD')
      expect(res.exchangeRates.length).to.eq(2)

      expect(res.exchangeRates[0].date).to.eq('2019-08-26')
      expect(res.exchangeRates[0].rate).to.eq('10137.745')

      expect(res.exchangeRates[1].date).to.eq('2019-08-27')
      expect(res.exchangeRates[1].rate).to.eq('10363.715')
    })
  })
})
