import { expect } from 'chai'

import * as addressModule from '../address'

describe('generateNewMultisigAddress', () => {
  it('should exist', () => {
    expect(addressModule.generateNewMultisigAddress).to.be.a('function')
  })

  it('should return proper address', () => {
    const pubKeys = [
      'xpub661MyMwAqRbcEbQrpBDMTDgW5Hjg5BFxoJD2SnzTmTASPxD4i4j1xMCKojYwgaRXXBRAHB7WPECxA2aQVfL61G4mWjnHMj6BJtAQKMVAiYs',
      'xpub661MyMwAqRbcGukLdXtbs5TTqkddNUYzdWAmZ3mQTRZgtaySzU9ePfVEZWtQJBZGbfKfhPZfG74z6TXkeEx2atofMhn2n4bHLzjDWHREM5u',
      'xpub661MyMwAqRbcGQQ9zYBFdkPxFBryTQwXCEr2zKsm2YBkeDFWbkKBUAWeRUaaseSmTWaat8npZ6nfyYqe1joSH6jsQdhK4W5fia35LgZfwVF'
    ]

    const { address, redeemScript } = addressModule.generateNewMultisigAddress(
      pubKeys,
      '0/23')

    expect(address).to.be.equal('32ora6gx1fLjdgbstMs4SdJhkC8QsMjcat')
    expect(redeemScript).to.be.an('Uint8Array')
  })
})

describe('createNewAddress', () => {
  it('should exist', () => {
    expect(addressModule.createNewAddress).to.be.a('function')
  })

  it('should accept 2 arguments and pass them backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    addressModule.createNewAddress = mockImplementation

    const res = await addressModule.createNewAddress('testToken', 'abcd')

    const [token, walletId, name] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('abcd')
    expect(name).to.eq(undefined)
    expect(res).to.eq('backend response')
  })

  it('should accept 3 arguments and pass them backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    addressModule.createNewAddress = mockImplementation

    const res = await addressModule.createNewAddress('testToken', 'abcd', 'testName')

    const [token, walletId, name] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('abcd')
    expect(name).to.eq('testName')
    expect(res).to.eq('backend response')
  })
})

describe('getAddress', () => {
  it('should exist', () => {
    expect(addressModule.getAddress).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    addressModule.getAddress = mockImplementation

    const res = await addressModule.getAddress('testToken', 'abcd', 'testAddress')

    const [token, walletId, address] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('abcd')
    expect(address).to.eq('testAddress')
    expect(res).to.eq('backend response')
  })
})

describe('listAddresses', () => {
  it('should exist', () => {
    expect(addressModule.listAddresses).to.be.a('function')
  })

  it('should pass proper arguments to backend-api method and return result of its call', async () => {
    // @ts-ignore
    const mockImplementation = jest.fn(() => 'backend response')
    // @ts-ignore
    addressModule.listAddresses = mockImplementation

    const res = await addressModule.listAddresses('testToken', 'testWalletId', 101, 'testNextPageToken')

    const [token, walletId, limit, nextPageToken] = mockImplementation.mock.calls[0]
    expect(token).to.eq('testToken')
    expect(walletId).to.eq('testWalletId')
    expect(limit).to.eq(101)
    expect(nextPageToken).to.eq('testNextPageToken')
    expect(res).to.eq('backend response')
  })
})
