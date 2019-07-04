import { expect } from 'chai'

import { currency } from '../helpers'
import * as apiFactory from '../../backend-api'
import * as bitcoinApiFactory from '../../bitcoin/bitcoin-backend-api'
const baseApi = apiFactory.create('backurl/api/v1', () => "")
const bitcoinApi = bitcoinApiFactory.withCurrency('backurl/api/v1', currency, () => '')
import * as request from '../../utils/request'
import { MaxTransferAmountBitcoinParams } from 'response'
import { PolicySettings, DailyAmountPolicy, PolicyKind } from '../../../types/domain'

// @ts-ignore
const mockImplementation = jest.fn(() => ({ data: 'testToken' }))
// @ts-ignore
request.default = mockImplementation

beforeEach(() => {
  // @ts-ignore
  mockImplementation.mockClear()
})

describe('login', () => {
  it('should exist', () => {
    expect(baseApi.login).to.be.a('function')
  })

  it('should send proper request', async () => {
    await baseApi.login('a', 'b')

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq('backurl/api/v1/user/login')
    expect(params.method).to.eq('POST')
    expect(reqBody.email).to.eq('a')
    expect(reqBody.password).to.eq('b')
    expect(reqBody).to.not.haveOwnProperty('code')
  })

  it('should send request with 2fa code', async () => {
    await baseApi.login('a', 'b', 123456)

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
    expect(baseApi.init2fa).to.be.a('function')
  })

  it('should send proper request', async () => {
    await baseApi.init2fa('testToken', 'password')

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq('backurl/api/v1/user/2fa/init')
    expect(params.method).to.eq('POST')
    expect(reqBody.password).to.eq('password')
  })
})

describe('confirm2fa', () => {
  it('should exist', () => {
    expect(baseApi.confirm2fa).to.be.a('function')
  })

  it('should send proper request', async () => {
    await baseApi.confirm2fa('testToken', 'password', 101202)

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
    expect(baseApi.disable2fa).to.be.a('function')
  })

  it('should send proper request', async () => {
    await baseApi.disable2fa('testToken', 'password', 112233)

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
    expect(baseApi.register).to.be.a('function')
  })

  it('should send proper request', async () => {
    await baseApi.register('a')

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq('backurl/api/v1/user/register')
    expect(params.method).to.eq('POST')
    expect(reqBody.email).to.eq('a')
  })
})

describe('info', () => {
  it('should exist', () => {
    expect(baseApi.info).to.be.a('function')
  })

  it('should send proper request', async () => {
    await baseApi.info('testToken')

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq('backurl/api/v1/user/info')
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('createWallet', () => {
  it('should exist', () => {
    expect(bitcoinApi.createWallet).to.be.a('function')
  })

  it('should send proper request when pub keys provided', async () => {
    const data = {
      name: 'testName',
      userPubKey: '123',
      backupPubKey: '456'
    }
    await bitcoinApi.createWallet('testToken', data)

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq(`backurl/api/v1/${currency}/wallet`)
    expect(params.method).to.eq('POST')
    expect(params.headers.Authorization).to.eq('testToken')
    expect(reqBody.name).to.eq('testName')
    expect(reqBody.userPubKey).to.eq('123')
    expect(reqBody.backupPubKey).to.eq('456')
  })
})
describe('getWallet', () => {
  it('should exist', () => {
    expect(bitcoinApi.getWallet).to.be.a('function')
  })

  it('should send proper request', async () => {
    await bitcoinApi.getWallet('testToken', '13')

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq(`backurl/api/v1/${currency}/wallet/13`)
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('listWallets', () => {
  it('should exist', () => {
    expect(bitcoinApi.getWallet).to.be.a('function')
  })

  it('should send proper request without nextPageToken', async () => {
    await bitcoinApi.listWallets('testToken', 10)

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq(`backurl/api/v1/${currency}/wallet?limit=10`)
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })

  it('should send proper request with nextPageToken', async () => {
    await bitcoinApi.listWallets('testToken', 10, 'searchPhrase','abcd')

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq(`backurl/api/v1/${currency}/wallet?limit=10&searchPhrase=searchPhrase&nextPageToken=abcd`)
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('createNewAddress', () => {
  it('should exist', () => {
    expect(bitcoinApi.createNewAddress).to.be.a('function')
  })

  it('should send proper request without name param', async () => {
    await bitcoinApi.createNewAddress('testToken', 'walletId', false)

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq(`backurl/api/v1/${currency}/wallet/walletId/address`)
    expect(params.method).to.eq('POST')
    expect(params.headers.Authorization).to.eq('testToken')
    expect(reqBody.name).to.eq(undefined)
    expect(reqBody.isChange).to.eq(false)
  })

  it('should send proper request for change address', async () => {
    await bitcoinApi.createNewAddress('testToken', 'walletId', true)

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq(`backurl/api/v1/${currency}/wallet/walletId/address`)
    expect(params.method).to.eq('POST')
    expect(params.headers.Authorization).to.eq('testToken')
    expect(reqBody.name).to.eq(undefined)
    expect(reqBody.isChange).to.eq(true)
  })

  it('should send proper request with name param', async () => {
    await bitcoinApi.createNewAddress('testToken', 'walletId', false, 'testName')

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)

    expect(url).to.eq(`backurl/api/v1/${currency}/wallet/walletId/address`)
    expect(params.method).to.eq('POST')
    expect(params.headers.Authorization).to.eq('testToken')
    expect(reqBody.name).to.eq('testName')
    expect(reqBody.isChange).to.eq(false)
  })
})

describe('getAddress', () => {
  it('should exist', () => {
    expect(bitcoinApi.getAddress).to.be.a('function')
  })

  it('should send proper request', async () => {
    await bitcoinApi.getAddress('testToken', 'testWalletId', 'addressValue')

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq(`backurl/api/v1/${currency}/wallet/testWalletId/address/addressValue`)
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('listAddresses', () => {
  it('should exist', () => {
    expect(bitcoinApi.listAddresses).to.be.a('function')
  })

  it('should send proper request without nextPageToken', async () => {
    await bitcoinApi.listAddresses('testToken', 'testWalletId', 10)

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq(`backurl/api/v1/${currency}/wallet/testWalletId/address?limit=10`)
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })

  it('should send proper request with nextPageToken', async () => {
    await bitcoinApi.listAddresses('testToken', 'testWalletId', 10, 'abcd')

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq(`backurl/api/v1/${currency}/wallet/testWalletId/address?limit=10&nextPageToken=abcd`)
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('listUnspents', () => {
  it('should exist', () => {
    expect(bitcoinApi.listUnspents).to.be.a('function')
  })

  it('should send proper request', async () => {
    const data = {
      feeRate: 22,
      recipients: [{ address: '0x0', amount: '888' }]
    }
    await bitcoinApi.listUnspents('testToken', 'testWalletId', data)

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)
    expect(url).to.eq(`backurl/api/v1/${currency}/wallet/testWalletId/utxo`)
    expect(params.method).to.eq('POST')
    expect(params.headers.Authorization).to.eq('testToken')
    expect(reqBody.feeRate).to.eq(22)
    expect(reqBody.recipients[0].address).to.eq('0x0')
    expect(reqBody.recipients[0].amount).to.eq('888')
  })
})

describe('sendTransaction', () => {
  it('should exist', () => {
    expect(bitcoinApi.sendTransaction).to.be.a('function')
  })
})

describe('getKey', () => {
  it('should exist', () => {
    expect(bitcoinApi.getKey).to.be.a('function')
  })

  it('should send proper request without includePrivate param', async () => {
    await bitcoinApi.getKey('testToken', 'testKeyId')

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq(`backurl/api/v1/${currency}/key/testKeyId`)
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })

  it('should send proper request with includePrivate param', async () => {
    await bitcoinApi.getKey('testToken', 'testKeyId', true)

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq(`backurl/api/v1/${currency}/key/testKeyId?includePrivate=true`)
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('maxTransferAmount', () => {
  it('should exist', () => {
    expect(bitcoinApi.maxTransferAmount).to.be.a('function')
  })

  it('should send proper request', async () => {
    const data: MaxTransferAmountBitcoinParams = {
      recipient: '0x0',
      feeRate: 22
    }
    await bitcoinApi.maxTransferAmount('testToken', 'testWalletId', data)

    const [url, params] = mockImplementation.mock.calls[0]
    expect(url).to.eq(`backurl/api/v1/${currency}/wallet/testWalletId/max-transfer-amount?recipient=0x0&feeRate=22`)
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('setupPassword', () => {
  it('should exist', () => {
    expect(baseApi.setupPassword).to.be.a('function')
  })

  it('should send proper request', async () => {
    await baseApi.setupPassword('testToken', 'secret')

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)
    expect(url).to.eq('backurl/api/v1/user/setup-password')
    expect(params.method).to.eq('POST')
    expect(params.headers.Authorization).to.eq('testToken')
    expect(reqBody.password).to.eq('secret')
  })
})

describe('createPolicy', () => {
  it('should exist', () => {
    expect(bitcoinApi.createPolicy).to.be.a('function')
  })

  it('should send proper request', async () => {
    const settings: PolicySettings = new DailyAmountPolicy('1.0')
    await bitcoinApi.createPolicy('testToken', { settings, name: 'a' })

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)
    expect(url).to.eq(`backurl/api/v1/${currency}/policy`)
    expect(params.method).to.eq('POST')
    expect(params.headers.Authorization).to.eq('testToken')
    expect(reqBody.settings.kind).to.be.eq(PolicyKind.MaxDailyAmount)
    expect(reqBody.settings.amount).to.be.eq('1.0')
  })
})

describe('listPolicies', () => {
  it('should exist', () => {
    expect(bitcoinApi.listPolicies).to.be.a('function')
  })

  it('should send proper request with limit', async () => {
    await bitcoinApi.listPolicies('testToken', 10)

    const [url, params] = mockImplementation.mock.calls[0]
    expect(url).to.eq(`backurl/api/v1/${currency}/policy?limit=10`)
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })

  it('should send proper request with limit and nextPageToken', async () => {
    await bitcoinApi.listPolicies('testToken', 10, '123')

    const [url, params] = mockImplementation.mock.calls[0]
    expect(url).to.eq(`backurl/api/v1/${currency}/policy?limit=10&nextPageToken=123`)
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('listPoliciesForWallet', () => {
  it('should exist', () => {
    expect(bitcoinApi.listPoliciesForWallet).to.be.a('function')
  })

  it('should send proper request', async () => {
    await bitcoinApi.listPoliciesForWallet('testToken', '123')

    const [url, params] = mockImplementation.mock.calls[0]
    expect(url).to.eq(`backurl/api/v1/${currency}/wallet/123/policy`)
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('listWalletsForPolicy', () => {
  it('should exist', () => {
    expect(bitcoinApi.listWalletsForPolicy).to.be.a('function')
  })

  it('should send proper request', async () => {
    await bitcoinApi.listWalletsForPolicy('testToken', '123')

    const [url, params] = mockImplementation.mock.calls[0]
    expect(url).to.eq(`backurl/api/v1/${currency}/policy/123/wallet`)
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('assignPolicy', () => {
  it('should exist', () => {
    expect(bitcoinApi.assignPolicy).to.be.a('function')
  })

  it('should send proper request', async () => {
    await bitcoinApi.assignPolicy('testToken', '123', { walletId: '456' })

    const [url, params] = mockImplementation.mock.calls[0]
    const reqBody = JSON.parse(params.body)
    expect(url).to.eq(`backurl/api/v1/${currency}/policy/123/assign`)
    expect(params.method).to.eq('POST')
    expect(params.headers.Authorization).to.eq('testToken')
    expect(reqBody.walletId).to.be.eq('456')
  })
})

describe('listTransfers', () => {
  it('should exist', () => {
    expect(baseApi.listTransfers).to.be.a('function')
  })

  it('should send proper request', async () => {
    await baseApi.listTransfers('testToken', 50, 'npt')

    const [url, params] = mockImplementation.mock.calls[0]
    expect(url).to.eq('backurl/api/v1/transfer?limit=50&nextPageToken=npt')
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('monthlySummary', () => {
  it('should exist', () => {
    expect(baseApi.monthlySummary).to.be.a('function')
  })

  it('should send proper request', async () => {
    await baseApi.monthlySummary('testToken', 5, 1223, 'pln')

    const [url, params] = mockImplementation.mock.calls[0]
    expect(url).to.eq('backurl/api/v1/transfer/monthly-summary/5/1223/pln')
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('list chain transfers', () => {
  it('should exist', () => {
    expect(bitcoinApi.listTransfers).to.be.a('function')
  })

  it('should send proper request', async () => {
    await bitcoinApi.listTransfers('testToken', 'testWalletId', 20, 'npt')

    const [url, params] = mockImplementation.mock.calls[0]
    expect(url).to.eq(`backurl/api/v1/${currency}/wallet/testWalletId/transfer?limit=20&nextPageToken=npt`)
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('find chain transfer by tx hash', () => {
  it('should exist', () => {
    expect(bitcoinApi.findTransferByTxHash).to.be.a('function')
  })

  it('should send proper request', async () => {
    await bitcoinApi.findTransferByTxHash('testToken', 'testWalletId', '0x20')

    const [url, params] = mockImplementation.mock.calls[0]
    expect(url).to.eq(`backurl/api/v1/${currency}/wallet/testWalletId/transfer/0x20`)
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})

describe('balance', () => {
  it('should exist', () => {
    expect(baseApi.balance).to.be.a('function')
  })

  it('should send proper request', async () => {
    const currency = 'USD'

    await baseApi.balance('testToken', currency)

    const [url, params] = mockImplementation.mock.calls[0]

    expect(url).to.eq(`backurl/api/v1/user/balance?fiatCurrency=${currency}`)
    expect(params.method).to.eq('GET')
    expect(params.headers.Authorization).to.eq('testToken')
  })
})
