import { expect } from 'chai'

import * as api from '../backend-api'
import * as request from '../utils/request'

// @ts-ignore
const mockImplementation = jest.fn(() => ({ data: 'testToken' }))
// @ts-ignore
request.default = mockImplementation

beforeEach(() => {
  // @ts-ignore
  mockImplementation.mockClear()
})

process.env.BACKEND_API_URL = 'backurl'

describe('login', () => {
  it('should exist', () => {
    expect(api.login).to.be.a('function')
  })

  it('should send proper request', async () => {
    await api.login('a', 'b')

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq('backurl/api/v1/user/login')
    expect(params.method).to.eq('POST')
    expect(reqBody.email).to.eq('a')
    expect(reqBody.password).to.eq('b')
  })
})

describe('register', () => {
  it('should exist', () => {
    expect(api.register).to.be.a('function')
  })

  it('should send proper request', async () => {
    await api.register('a', 'b')

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq('backurl/api/v1/user/register')
    expect(params.method).to.eq('POST')
    expect(reqBody.email).to.eq('a')
    expect(reqBody.password).to.eq('b')
  })
})

describe('info', () => {
  it('should exist', () => {
    expect(api.info).to.be.a('function')
  })

  it('should send proper request', async () => {
    await api.info('testToken')

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq('backurl/api/v1/user/info')
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('createWallet', () => {
  it('should exist', () => {
    expect(api.createWallet).to.be.a('function')
  })

  it('should send proper request', async () => {
    const data = {
      name: 'testName',
      userPubKey: '123',
      backupPubKey: '456'
    }
    await api.createWallet('testToken', data)

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq('backurl/api/v1/btc/wallet')
    expect(params.method).to.eq('POST')
    expect(params.headers.Authorization).to.eq('testToken')
    expect(reqBody.name).to.eq('testName')
    expect(reqBody.userPubKey).to.eq('123')
    expect(reqBody.backupPubKey).to.eq('456')
  })
})

describe('getWallet', () => {
  it('should exist', () => {
    expect(api.getWallet).to.be.a('function')
  })

  it('should send proper request', async () => {
    await api.getWallet('testToken', '13')

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq('backurl/api/v1/btc/wallet/13')
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('listWallets', () => {
  it('should exist', () => {
    expect(api.getWallet).to.be.a('function')
  })

  it('should send proper request without nextPageToken', async () => {
    await api.listWallets('testToken', 10)

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq('backurl/api/v1/btc/wallet?limit=10')
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })

  it('should send proper request with nextPageToken', async () => {
    await api.listWallets('testToken', 10, 'abcd')

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq('backurl/api/v1/btc/wallet?limit=10&nextPageToken=abcd')
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('getWalletBalance', () => {
  it('should exist', () => {
    expect(api.getWalletBalance).to.be.a('function')
  })

  it('should send proper request', async () => {
    await api.getWalletBalance('testToken', '13')

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq('backurl/api/v1/btc/wallet/13/balance')
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('createNewAddress', () => {
  it('should exist', () => {
    expect(api.createNewAddress).to.be.a('function')
  })

  it('should send proper request without name param', async () => {
    await api.createNewAddress('testToken', 'walletId')

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq('backurl/api/v1/btc/wallet/walletId/address')
    expect(params.method).to.eq('POST')
    expect(params.headers.Authorization).to.eq('testToken')
    expect(reqBody.name).to.eq(undefined)
  })

  it('should send proper request with name param', async () => {
    await api.createNewAddress('testToken', 'walletId', 'testName')

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq('backurl/api/v1/btc/wallet/walletId/address')
    expect(params.method).to.eq('POST')
    expect(params.headers.Authorization).to.eq('testToken')
    expect(reqBody.name).to.eq('testName')
  })
})

describe('getAddress', () => {
  it('should exist', () => {
    expect(api.getAddress).to.be.a('function')
  })

  it('should send proper request', async () => {
    await api.getAddress('testToken', 'testWalletId', 'addressValue')

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq('backurl/api/v1/btc/wallet/testWalletId/address/addressValue')
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('listAddresses', () => {
  it('should exist', () => {
    expect(api.listAddresses).to.be.a('function')
  })

  it('should send proper request without nextPageToken', async () => {
    await api.listAddresses('testToken', 'testWalletId', 10)

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq('backurl/api/v1/btc/wallet/testWalletId/address?limit=10')
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })

  it('should send proper request with nextPageToken', async () => {
    await api.listAddresses('testToken', 'testWalletId', 10, 'abcd')

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq('backurl/api/v1/btc/wallet/testWalletId/address?limit=10&nextPageToken=abcd')
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('listUnspents', () => {
  it('should exist', () => {
    expect(api.listUnspents).to.be.a('function')
  })

  it('should send proper request', async () => {
    await api.listUnspents('testToken', 'testWalletId', 888, 22)

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq('backurl/api/v1/btc/wallet/testWalletId/utxo?amountBtc=888&feeRateSatoshi=22')
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('sendTransaction', () => {
  it('should exist', () => {
    expect(api.sendTransaction).to.be.a('function')
  })
})

describe('getKey', () => {
  it('should exist', () => {
    expect(api.getKey).to.be.a('function')
  })

  it('should send proper request without includePrivate param', async () => {
    await api.getKey('testToken', 'testKeyId')

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq('backurl/api/v1/btc/key/testKeyId')
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })

  it('should send proper request with includePrivate param', async () => {
    await api.getKey('testToken', 'testKeyId', true)

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq('backurl/api/v1/btc/key/testKeyId?includePrivate=true')
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('ethGetTransactionParams', () => {
  it('should exist', () => {
    expect(api.ethGetTransactionParams).to.be.a('function')
  })
})

describe('ethSendTransaction', () => {
  it('should exist', () => {
    expect(api.ethSendTransaction).to.be.a('function')
  })
})
