import { expect } from 'chai'
import bitcoinjsLib from 'bitcoinjs-lib'

import * as address from '../address'
import * as wallet from '../wallet'

describe('generateNewMultisigAddress', () => {
  it('should exist', () => {
    expect(address.generateNewMultisigAddress).to.be.a('function')
  })

  it('should return proper address', () => {
    const pubKeys = [
      '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
      '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
      '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59'
    ].map((hex: string) => bitcoinjsLib.HDNode.fromSeedBuffer(Buffer.from(hex, 'hex')).toBase58())

    const result = address.generateNewMultisigAddress(
      pubKeys,
      '0/23')

    expect(result).to.be.equal('38zHqEAEASmZuaizXdz4G7fenwtsFD6Cak')
  })
})

describe('deriveChildKey', () => {
  it('should exist', () => {
    expect(address.deriveKey).to.be.a('function')
  })

  it('should create new hardened key for a given path', () => {
    const path = `0'`
    const keychain = wallet.createKeychain('test_label')

    const result = address.deriveKey(keychain.xprv, path)

    expect(result).to.have.property('keyPair')
  })

  it('should create new normal key for a given path', () => {
    const path = `11/20/15`
    const keychain = wallet.createKeychain('test_label')

    const result = address.deriveKey(keychain.xpub, path)

    expect(result).to.have.property('keyPair')
  })
})

describe('getNextAddressIndex', () => {
  it('should exist', () => {
    expect(address.getNextAddressIndex).to.be.a('function')
  })

  it('should return index', () => {
    const result = address.getNextAddressIndex(testWallet)

    expect(result).to.be.a('number')
  })

  it('should return proper receive index', () => {
    const testWalletModified = {
      ...testWallet, addresses: {
        receive: [
          { path: '', value: '' }, { path: '', value: '' }, { path: '', value: '' }
        ],
        change: []
      }
    }

    const result = address.getNextAddressIndex(testWalletModified)

    expect(result).to.be.equal(3)
  })

  it('should return proper change index', () => {
    const testWalletModified = {
      ...testWallet, addresses: {
        receive: [
          { path: '', value: '' }, { path: '', value: '' }, { path: '', value: '' }
        ],
        change: []
      }
    }

    const result = address.getNextAddressIndex(testWalletModified)

    expect(result).to.be.equal(3)
  })

  it('should return proper receive index', () => {
    const testWalletModified = {
      ...testWallet, addresses: {
        receive: [
          { path: '', value: '' }, { path: '', value: '' }, { path: '', value: '' }
        ],
        change: []
      }
    }

    const result = address.getNextAddressIndex(testWalletModified, true)

    expect(result).to.be.equal(0)
  })
})

describe('addNewAddress', () => {
  it('should exist', () => {
    expect(address.addNewAddress).to.be.a('function')
  })

  it('should should return a wallet with a new receive address', () => {
    const result = address.addNewAddress(testWallet, testAddress)

    expect(result.addresses.receive[0]).to.be.equal(testAddress)
  })

  it('should should return a wallet with a new change address', () => {
    const testWalletModified = {
      ...testWallet, addresses: {
        receive: [],
        change: [
          { path: '', value: '' }, { path: '', value: '' }, { path: '', value: '' }
        ]
      }
    }

    const result = address.addNewAddress(testWalletModified, testAddress, true)

    expect(result.addresses.change[3]).to.be.equal(testAddress)
  })
})

const testWallet = {
  id: 132,
  pubKeys: [
    wallet.createKeychain('userKey').xpub,
    wallet.createKeychain('backupKey').xpub,
    wallet.createKeychain('serverKey').xpub
  ],
  addresses: {
    change: [],
    receive: []
  }
}

const testAddress = {
  path: 'test_path',
  value: 'test_value'
}
