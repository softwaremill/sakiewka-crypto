import { expect } from 'chai'
import {
  addressModuleFactory,
  bitcoinAddressApiFactory,
} from '../../bitcoin/bitcoin-address'
import * as backendFactory from '../../bitcoin/bitcoin-backend-api'
import { keyModuleFactory } from '../../bitcoin/bitcoin-key'
import bitcoinFactory from '../../bitcoin/bitcoin'
import { Currency } from '../../..'
import { createHttpClient } from '../../utils/httpClient'
import { forBTCandBTG } from '../../utils/helpers'

forBTCandBTG('bitcoin address', (currency) => {
  const backendApi = backendFactory.withCurrency(
    'https://backendApiUrl',
    currency,
    createHttpClient(() => ''),
  )

  describe('generateNewMultisigAddress', () => {
    it('should exist', () => {
      const bitcoin = bitcoinFactory(currency, 'mainnet')
      const keyModule = keyModuleFactory(bitcoin)
      const addressModule = addressModuleFactory(bitcoin, keyModule)
      expect(addressModule.generateNewMultisigAddress).to.be.a('function')
    })

    it('should return proper address', () => {
      const bitcoin = bitcoinFactory(currency, 'mainnet')
      const keyModule = keyModuleFactory(bitcoin)
      const addressModule = addressModuleFactory(bitcoin, keyModule)

      const pubKeys = [
        'xpub661MyMwAqRbcEbQrpBDMTDgW5Hjg5BFxoJD2SnzTmTASPxD4i4j1xMCKojYwgaRXXBRAHB7WPECxA2aQVfL61G4mWjnHMj6BJtAQKMVAiYs',
        'xpub661MyMwAqRbcGukLdXtbs5TTqkddNUYzdWAmZ3mQTRZgtaySzU9ePfVEZWtQJBZGbfKfhPZfG74z6TXkeEx2atofMhn2n4bHLzjDWHREM5u',
        'xpub661MyMwAqRbcGQQ9zYBFdkPxFBryTQwXCEr2zKsm2YBkeDFWbkKBUAWeRUaaseSmTWaat8npZ6nfyYqe1joSH6jsQdhK4W5fia35LgZfwVF',
      ]

      const { address, redeemScript } = addressModule.generateNewMultisigAddress(
        pubKeys,
        '0/23',
      )

      expect(address).to.be.equal(
        currency === Currency.BTG
          ? 'AMjMb4MM1tRBprrFtgQY3pwrxsV9tXfdPM'
          : '37eVs6zAEe5R74LhT8QoKa3hdnrB8yRqY9',
      )
      expect(redeemScript).to.be.an('Uint8Array')
    })

    it('should return proper testnet address', () => {
      const bitcoin = bitcoinFactory(currency, 'testnet')
      const keyModule = keyModuleFactory(bitcoin)
      const addressModule = addressModuleFactory(bitcoin, keyModule)
      const pubKeys = [
        'tpubD6NzVbkrYhZ4YLQpJAWwxCiNVAH13QSiFHWWTRmocy5zCMN6Nr8fbLVN38Y5nu7KwZ24ux74qotyyNkeF9KN52Gawcjr4ujHkQUDTBmw8Bu',
        'tpubD6NzVbkrYhZ4YWW2LBu48ZLMDtU6YZNug3dArpmhCZVCeRduVLF9FRNaLbwkND5Twf4DS1aXuFqvYd1S4BBTFGwjDM7iy1CK8vuwJHYqpdd',
        'tpubD6NzVbkrYhZ4YjDKW7sGf2uqBaCPzstZwrEAXSNhWKze43HqujV38SeGLAtjq4XPts9D5Fb4dWbiP9DtuZPt75DQSeU5U9QLzoMtCtsf92b',
      ]

      const { address, redeemScript } = addressModule.generateNewMultisigAddress(
        pubKeys,
        '0/23',
      )

      expect(address).to.be.equal('2NEUaAjCuGc2M7YnzyrkvkE6LH1fx3M89Zi')
      expect(redeemScript).to.be.an('Uint8Array')
    })
  })

  describe('createNewAddress', () => {
    const addressApi = bitcoinAddressApiFactory(backendApi)
    it('should exist', () => {
      expect(addressApi.createNewAddress).to.be.a('function')
    })

    it('should accept 2 arguments and pass them backend-api method and return result of its call', async () => {
      // @ts-ignore
      const mockImplementation = jest.fn(() => 'backend response')
      // @ts-ignore
      backendApi.createNewAddress = mockImplementation

      const res = await addressApi.createNewAddress('testToken', 'abcd')

      const [token, walletId, isChange, name] = mockImplementation.mock.calls[0]
      expect(token).to.eq('testToken')
      expect(walletId).to.eq('abcd')
      expect(isChange).to.eq(false)
      expect(name).to.eq(undefined)
      expect(res).to.eq('backend response')
    })

    it('should accept 3 arguments and pass them backend-api method and return result of its call', async () => {
      // @ts-ignore
      const mockImplementation = jest.fn(() => 'backend response')
      // @ts-ignore
      backendApi.createNewAddress = mockImplementation

      const res = await addressApi.createNewAddress(
        'testToken',
        'abcd',
        'testName',
      )

      const [token, walletId, isChange, name] = mockImplementation.mock.calls[0]
      expect(token).to.eq('testToken')
      expect(walletId).to.eq('abcd')
      expect(isChange).to.eq(false)
      expect(name).to.eq('testName')
      expect(res).to.eq('backend response')
    })
  })

  describe('getAddress', () => {
    const addressModule = bitcoinAddressApiFactory(backendApi)

    it('should exist', () => {
      expect(addressModule.getAddress).to.be.a('function')
    })

    it('should pass proper arguments to backend-api method and return result of its call', async () => {
      // @ts-ignore
      const mockImplementation = jest.fn(() => ({ address: 'test address' }))
      // @ts-ignore
      backendApi.getAddress = mockImplementation

      const res = await addressModule.getAddress(
        'testToken',
        'abcd',
        'testAddress',
      )

      const [token, walletId, address] = mockImplementation.mock.calls[0]
      expect(token).to.eq('testToken')
      expect(walletId).to.eq('abcd')
      expect(address).to.eq('testAddress')
      expect(res.address).to.eq('test address')
    })
  })

  describe('listAddresses', () => {
    const addressModule = bitcoinAddressApiFactory(backendApi)

    it('should exist', () => {
      expect(addressModule.listAddresses).to.be.a('function')
    })

    it('should pass proper arguments to backend-api method and return result of its call', async () => {
      // @ts-ignore
      const mockImplementation = jest.fn(() => ({
        addresses: [{ address: 'test address 1' }, { address: 'test address 2' }],
      }))
      // @ts-ignore
      backendApi.listAddresses = mockImplementation

      const res = await addressModule.listAddresses(
        'testToken',
        'testWalletId',
        101,
        'testNextPageToken',
      )

      const [
        token,
        walletId,
        limit,
        nextPageToken,
      ] = mockImplementation.mock.calls[0]
      expect(token).to.eq('testToken')
      expect(walletId).to.eq('testWalletId')
      expect(limit).to.eq(101)
      expect(nextPageToken).to.eq('testNextPageToken')
      expect(res.addresses[0].address).to.eq('test address 1')
      expect(res.addresses[1].address).to.eq('test address 2')
    })
  })
})
