import { expect } from 'chai'
import * as backendApiFactory from '../../eos/eos-backend-api'
import { createHttpClient } from '../../utils/httpClient'
import { accountFeeApiFactory } from '../../eos/eos-account-fee'

const backendApi = backendApiFactory.eosBackendApiFactory(
  'http://backendApiUrl',
  createHttpClient(() => ''),
)

// @ts-ignore
backendApi.getAccountFee = jest.fn(() => {
  return Promise.resolve({
    balance: '1337',
  })
})

describe('getAccountFee', () => {
  const keyModule = accountFeeApiFactory(backendApi)
  it('should exist', () => {
    expect(keyModule.getAccountFee).to.be.a('function')
  })

  it('should pass proper arguments to backend-api and return result', async () => {
    const res = await keyModule.getAccountFee('testToken')
    expect(res.balance).to.eq('1337')
  })
})
