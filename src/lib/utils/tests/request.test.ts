import { expect } from 'chai'
import * as nodeFetch from 'node-fetch'

import request from '../request'

describe('request', () => {
  it('should exist', () => {
    expect(request).to.be.a('function')
  })

  it('should return proper error message', async () => {
    // @ts-ignore
    nodeFetch.default = jest.fn(() => {
      return Promise.resolve(new nodeFetch.Response(
        JSON.stringify({
          error: {
            message: 'test error'
          }
        }),
        { status : 400 , statusText : '' }
      ))
    })

    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer 69c464263aa0551861b442a08ddc37b21742908fbba37d9bc53df745ae95b0fa'
      }
    }

    try {
      await request(`http://localhost:8081/api/v1/btc/wallet/6416e7ee4d184f7d44c96a337ce74824eab444a656a3df53d6a55477304dd14f/utxo?amountBtc=333&feeRateSatoshi=22`, options)
    } catch (err) {
      expect(err.message).to.eq('test error')
    }
  })
})
