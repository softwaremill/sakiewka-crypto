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

process.env.BACKEND_API_URL = 'backurl/api/v1'

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
    expect(reqBody).to.not.haveOwnProperty('code')
  })

  it('should send request with 2fa code', async () => {
    await api.login('a', 'b', 123456)

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq('backurl/api/v1/user/login')
    expect(params.method).to.eq('POST')
    expect(reqBody.email).to.eq('a')
    expect(reqBody.password).to.eq('b')
    expect(reqBody.code).to.eq(123456)
  })
})

describe('init2fa', () => {
  it('should exist', () => {
    expect(api.init2fa).to.be.a('function')
  })

  it('should send proper request', async () => {
    await api.init2fa('testToken', 'password')

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq('backurl/api/v1/user/2fa/init')
    expect(params.method).to.eq('POST')
    expect(reqBody.password).to.eq('password')
  })
})

describe('confirm2fa', () => {
  it('should exist', () => {
    expect(api.confirm2fa).to.be.a('function')
  })

  it('should send proper request', async () => {
    await api.confirm2fa('testToken', 'password', 101202)

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq('backurl/api/v1/user/2fa/confirm')
    expect(params.method).to.eq('POST')
    expect(reqBody.password).to.eq('password')
    expect(reqBody.code).to.eq(101202)
  })
})

describe('disable2fa', () => {
  it('should exist', () => {
    expect(api.disable2fa).to.be.a('function')
  })

  it('should send proper request', async () => {
    await api.disable2fa('testToken', 'password', 112233)

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq('backurl/api/v1/user/2fa/disable')
    expect(params.method).to.eq('POST')
    expect(reqBody.password).to.eq('password')
    expect(reqBody.code).to.eq(112233)
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

  it('should send proper request when pub keys provided', async () => {
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

    expect(url).to.eq('backurl/api/v1/btc/wallet/walletId/address?change=false')
    expect(params.method).to.eq('POST')
    expect(params.headers.Authorization).to.eq('testToken')
    expect(reqBody.name).to.eq(undefined)
  })

  it('should send proper request for change address', async () => {
    await api.createNewAddress('testToken', 'walletId', true)

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq('backurl/api/v1/btc/wallet/walletId/address?change=true')
    expect(params.method).to.eq('POST')
    expect(params.headers.Authorization).to.eq('testToken')
    expect(reqBody.name).to.eq(undefined)
  })

  it('should send proper request with name param', async () => {
    await api.createNewAddress('testToken', 'walletId', false, 'testName')

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq('backurl/api/v1/btc/wallet/walletId/address?change=false')
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
    const data = {
      feeRate: '22',
      recipients: [{ address: '0x0', amount: '888' }]
    }
    await api.listUnspents('testToken', 'testWalletId', data)

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)
    expect(url).to.eq('backurl/api/v1/btc/wallet/testWalletId/utxo')
    expect(params.method).to.eq('POST')
    expect(params.headers.Authorization).to.eq('testToken')
    expect(reqBody.feeRate).to.eq('22')
    expect(reqBody.recipients[0].address).to.eq('0x0')
    expect(reqBody.recipients[0].amount).to.eq('888')
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
