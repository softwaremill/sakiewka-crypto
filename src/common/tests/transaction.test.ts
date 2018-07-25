import { expect } from 'chai'
import bitcoinjsLib from 'bitcoinjs-lib'

import * as transaction from '../transaction'
import * as backendApi from '../backend-api'
import * as fees from '../utils/fees'
import { getRandomBytes } from '../crypto'

// helpers
export const generateNewKeypair = () => {
  return bitcoinjsLib.HDNode.fromSeedBuffer(
    new Buffer(getRandomBytes(512 / 8))
  )
}

const generateNewMultisigAddress = (rootKeys: Buffer[]) => {
  const redeemScript = bitcoinjsLib.script.multisig.output.encode(2, rootKeys)
  const scriptPubKey = bitcoinjsLib.script.scriptHash.output.encode(
    bitcoinjsLib.crypto.hash160(redeemScript)
  )
  const address = bitcoinjsLib.address.fromOutputScript(scriptPubKey)

  return {
    address,
    redeemScript,
    scriptPubKey
  }
}

describe('sendCoins', () => {
  // mocks
  // @ts-ignore
  backendApi.getNewChangeAddress = jest.fn(() => {
    return Promise.resolve('3DS7Y6bdePdnFCoXqddkevovh4s5M8NhgM')
  })

  // @ts-ignore
  fees.getRecommendedFee = jest.fn(() => {
    return Promise.resolve(5)
  })

  it('should exist', () => {
    expect(transaction.sendCoins).to.be.a('function')
  })

  it('should send coins', async () => {
    // generates keypairs and address
    const userKeypair = generateNewKeypair()
    const backupKeypair = generateNewKeypair()
    const serverKeypair = generateNewKeypair()
    const anotherKeypair = generateNewKeypair()

    const { address, redeemScript } = generateNewMultisigAddress([
      userKeypair.getPublicKeyBuffer(),
      backupKeypair.getPublicKeyBuffer(),
      serverKeypair.getPublicKeyBuffer()
    ])

  // @ts-ignore
    backendApi.getWalletUnspents = jest.fn(() => {
      return Promise.resolve([
        {
          address,
          txId: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          index: 0,
          path: '0/0',
          amount: 700000000
        }
      ])
    })

  // @ts-ignore
    backendApi.getWallet = jest.fn(() => {
      return Promise.resolve({
        pubKeys: [
          userKeypair.neutered().toBase58(),
          backupKeypair.neutered().toBase58(),
          serverKeypair.neutered().toBase58()
        ]
      })
    })

    const { transactionHex, status } = await transaction.sendCoins({
      walletId: '13',
      userToken: '1234',
      walletPassphrase: 'abcd',
      recipents: [{
        address: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN',
        amount: 500000000
      }],
      xprv: userKeypair.toBase58()
    })

    // recreates transaction builder
    const tx = bitcoinjsLib.Transaction.fromHex(transactionHex)
    const txb = bitcoinjsLib.TransactionBuilder.fromTransaction(tx, bitcoinjsLib.networks.bitcoin)

    // should be able to sign with other keys without errors
    txb.sign(0, serverKeypair.keyPair, redeemScript)

    // signing again or using wrong key should throw errors
    expect(() => {
      txb.sign(0, userKeypair.keyPair, redeemScript)
    }).to.throw('Signature already exists')

    expect(() => {
      txb.sign(0, anotherKeypair.keyPair, redeemScript)
    }).to.throw('Key pair cannot sign for this input')

    expect(status).to.be.true
    expect(tx.outs.length).to.be.eq(2)
    expect(tx.ins.length).to.be.eq(1)
  })
})

describe('sendCoins to multiple outputs', () => {
  it('should exist', () => {
    expect(transaction.sendCoins).to.be.a('function')
  })

  it('should send coins', async () => {
    // generates keypairs and address
    const userKeypair = generateNewKeypair()
    const backupKeypair = generateNewKeypair()
    const serverKeypair = generateNewKeypair()

    const { address } = generateNewMultisigAddress([
      userKeypair.getPublicKeyBuffer(),
      backupKeypair.getPublicKeyBuffer(),
      serverKeypair.getPublicKeyBuffer()
    ])

    // mocks getWalletUnspents
  // @ts-ignore
    backendApi.getWalletUnspents = jest.fn(() => {
      return Promise.resolve([
        {
          address,
          txId: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          index: 0,
          path: '0/0',
          amount: 700000000
        }
      ])
    })

    // mocks getWallet
  // @ts-ignore
    backendApi.getWallet = jest.fn(() => {
      return Promise.resolve({
        pubKeys: [
          userKeypair.neutered().toBase58(),
          backupKeypair.neutered().toBase58(),
          serverKeypair.neutered().toBase58()
        ]
      })
    })

    // mocks getNewChangeAddress
  // @ts-ignore
    backendApi.getNewChangeAddress = jest.fn(() => {
      return Promise.resolve('3DS7Y6bdePdnFCoXqddkevovh4s5M8NhgM')
    })

    const { transactionHex, status } = await transaction.sendCoins({
      walletId: '13',
      userToken: '1234',
      walletPassphrase: 'abcd',
      recipents: [
        {
          address: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN',
          amount: 500000000
        },
        {
          address: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN',
          amount: 1500
        }
      ],
      xprv: userKeypair.toBase58()
    })

    const tx = bitcoinjsLib.Transaction.fromHex(transactionHex)

    expect(status).to.be.true
    expect(tx.outs.length).to.be.eq(3)
    expect(tx.ins.length).to.be.eq(1)
  })
})

describe('calculateChange', () => {
  it('should exist', () => {
    expect(transaction.calculateChange).to.be.a('function')
  })

  it('should caluclate change', () => {
    const unspents = [
      { amount: 14, address: 'asda', txId: 'asda', index: 0, path: '0/0' },
      { amount: 2, address: 'asda', txId: 'asda', index: 0, path: '0/0' },
      { amount: 9, address: 'asda', txId: 'asda', index: 0, path: '0/0' }
    ]

    const result = transaction.calculateChange(unspents, 10)

    expect(result).to.be.eq(15)
  })

  it('should caluclate change for empty unspents', () => {
    const unspents = []
    const result = transaction.calculateChange(unspents, 0)

    expect(result).to.be.eq(0)
  })
})

describe('calculateFee', () => {
  it('should exist', () => {
    expect(transaction.calculateFee).to.be.a('function')
  })

  it('should properly calculate fee', () => {
    const result = transaction.calculateFee(3, 4, 2)
    expect(result).to.eq(2394)
  })
})

describe('sumOutputAmounts', () => {
  it('should exist', () => {
    expect(transaction.sumOutputAmounts).to.be.a('function')
  })

  it('should properly sum output amounts', () => {
    const result = transaction.sumOutputAmounts([
      { address: '', amount: 13211 },
      { address: '', amount: 98 },
      { address: '', amount: 989 }
    ])
    expect(result).to.eq(14298)
  })
})
