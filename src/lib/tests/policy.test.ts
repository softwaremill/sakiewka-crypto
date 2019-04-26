import { expect, use } from 'chai'

import { currency } from './helpers'
import * as backendApiFactory from '../backend-api'
import BigNumber from 'bignumber.js'
import chaiBigNumber from 'chai-bignumber'
import { DailyAmountPolicy } from '../../types/domain'
import { policyApiFactory } from '../policies';
const backendApi = backendApiFactory.withCurrency('http://backendApiUrl', currency)

const policy = policyApiFactory(backendApi)

beforeEach(() => {
  use(chaiBigNumber(BigNumber))
})

describe('addPolicy', () => {
  it('should exist', () => {
    expect(policy.createPolicy).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    backendApi.createPolicy = mockImplementation

    const res = await policy.createPolicy('testToken', new DailyAmountPolicy('11'))

    const [token, settings] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(settings).to.eql(new DailyAmountPolicy('11'))
    expect(res).to.eq('backend response')
  })
})

describe('listPolicies', () => {
  it('should exist', () => {
    expect(policy.listPolicies).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method - only limit', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    backendApi.listPolicies = mockImplementation

    const res = await policy.listPolicies('testToken', 10)

    const [token, limit] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(limit).to.eq(10)
    expect(res).to.eq('backend response')
  })

  it('should pass proper arguments to backend-api method - with nextPageToken', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    backendApi.listPolicies = mockImplementation

    const res = await policy.listPolicies('testToken', 10, '123444')

    const [token, limit, nextPageToken] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(limit).to.eq(10)
    expect(nextPageToken).to.eq('123444')
    expect(res).to.eq('backend response')
  })
})

describe('listWalletsForPolicy', () => {
  it('should exist', () => {
    expect(policy.listWalletsForPolicy).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    backendApi.listWalletsForPolicy = mockImplementation

    const res = await policy.listWalletsForPolicy('testToken', '11')

    const [token, policyId] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(policyId).to.eq('11')
    expect(res).to.eq('backend response')
  })
})

describe('assignPolicy', () => {
  it('should exist', () => {
    expect(policy.assignPolicy).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    backendApi.assignPolicy = mockImplementation

    const res = await policy.assignPolicy('testToken', 'policyId', 'walletId')

    const [token, policyId, walletId] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(policyId).to.eq('policyId')
    expect(walletId).to.eql({walletId: 'walletId'})
    expect(res).to.eq('backend response')
  })
})