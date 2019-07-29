import { expect } from 'chai'

import * as backendApiFactory from '../backend-api'
import { transfersApiFactory } from '../transfers'
import { createHttpClient } from '../utils/httpClient'

const backendApi = backendApiFactory.create(
  'http://backendApiUrl',
  createHttpClient(() => ''),
)
const transfersApi = transfersApiFactory(backendApi)

beforeEach(() => {
  // @ts-ignore
  backendApi.listTransfers = jest.fn(() => 'backend response')
  // @ts-ignore
  backendApi.monthlySummary = jest.fn(() => 'backend response')
})

describe('transfers - listTransfers', () => {
  it('should exist', () => {
    expect(transfersApi.listTransfers).to.be.a('function')
  })

  it('should pass proper arguments to backend', async () => {
    const result = await transfersApi.listTransfers('testToken', 123)

    expect(result).to.be.eq('backend response')
    const [
      token,
      limit,
      nextPageToken,
      // @ts-ignore
    ] = backendApi.listTransfers.mock.calls[0]
    expect(token).to.be.eq('testToken')
    expect(limit).to.be.eq(123)
    expect(nextPageToken).to.be.undefined
  })

  it('should pass nextPageToken to backend', async () => {
    const result = await transfersApi.listTransfers('testToken', 123, 'npt')

    expect(result).to.be.eq('backend response')
    const [
      token,
      limit,
      nextPageToken,
      // @ts-ignore
    ] = backendApi.listTransfers.mock.calls[0]
    expect(token).to.be.eq('testToken')
    expect(limit).to.be.eq(123)
    expect(nextPageToken).to.be.eq('npt')
  })
})

describe('transfers - monthly summary', () => {
  it('should exist', () => {
    expect(transfersApi.monthlySummary).to.be.a('function')
  })

  it('should pass proper arguments to backend', async () => {
    const result = await transfersApi.monthlySummary(
      'testToken',
      5,
      1999,
      'pln',
    )

    expect(result).to.be.eq('backend response')
    const [
      token,
      month,
      year,
      fiatCurrency,
      // @ts-ignore
    ] = backendApi.monthlySummary.mock.calls[0]
    expect(token).to.be.eq('testToken')
    expect(month).to.be.eq(5)
    expect(year).to.be.eq(1999)
    expect(fiatCurrency).to.be.eq('pln')
  })
})
