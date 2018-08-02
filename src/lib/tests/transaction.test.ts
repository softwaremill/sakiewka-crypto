import { expect } from 'chai'

import * as transaction from '../transaction'
import * as backendApi from '../backend-api'
import * as fees from '../utils/fees'
import { generateNewKeypair, deriveKey } from '../wallet'
import { generateNewMultisigAddress } from '../address'
import {
  txFromHex, txBuilderFromTx
} from '../bitcoin'

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
      userKeypair.pubKey,
      backupKeypair.pubKey,
      serverKeypair.pubKey
    ], '0/0')

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
          userKeypair.pubKey,
          backupKeypair.pubKey,
          serverKeypair.pubKey
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
      xprv: userKeypair.prvKey
    })

    const serverECPair = deriveKey(serverKeypair.prvKey, '0/0').keyPair
    const userECPair = deriveKey(userKeypair.prvKey, '0/0').keyPair
    const anotherECPair = deriveKey(anotherKeypair.prvKey, '0/0').keyPair

    // recreates transaction builder
    const tx = txFromHex(transactionHex)
    const txb = txBuilderFromTx(tx)

    // should be able to sign with other keys without errors
    txb.sign(0, serverECPair, redeemScript)

    // signing again or using wrong key should throw errors
    expect(() => {
      txb.sign(0, userECPair, redeemScript)
    }).to.throw('Signature already exists')

    expect(() => {
      txb.sign(0, anotherECPair, redeemScript)
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
      userKeypair.pubKey,
      backupKeypair.pubKey,
      serverKeypair.pubKey
    ], '')

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
          userKeypair.pubKey,
          backupKeypair.pubKey,
          serverKeypair.pubKey
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
      xprv: userKeypair.prvKey
    })

    const tx = txFromHex(transactionHex)

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

// Creating real testnet transaction
// 1. Send testnet bitcoin to address
// 2. Provide txId, txIndex and txAmount of this funding transaction
// 3. Copy outputted txHash and broadcast it

// describe('create real testnet transaction', () => {
//   it('should generate testnet tx hash', async () => {
//     const txId = '' // provide unspent txid here
//     const txIdx = 0 // provide unspent transaction input index
//     const txAmount = 0 // provide unspent tx

//     const xprv1 = 'tprv8ZgxMBicQKsPd5efWXL7M9ZBgWiwU8xrdeXtVfSuJ5JbZABerqTrmHnbVZbi2ANbuYSb6J5ZD9LtQEPsUNt1zknTYHQKRzJedUUx442sk6Z'
//     const xprv2 = 'tprv8ZgxMBicQKsPcy7qL5y7ggNfpX3DCVaZxe2yUrCNR2aKez4FuQSfSPBu5GafD16Qg8TQUZxShFunUhkNC8SSE8Z9URdSjjQsJnVDM4Utzyk'
//     const xprv3 = 'tprv8ZgxMBicQKsPf4K18wyeji4CiWKvZo8fvYcEDGnsRhVTFRbrB9HJJxgiAtAceAgbARKcBKBx3gREx5yrZbywGZk5fvz7mrE42DS2dLYj27j'

//     const xpub1 = 'tpubD6NzVbkrYhZ4WYgTQAzhkZDJFYEsdU9mCx8fnBVCiM6zPeSRVEHSwnQTfhsDNBSbQEoxwDG3ZsSRq66wXJLzy3FexB88qzNUUFTZ9zqtaj4'
//     const xpub2 = 'tpubD6NzVbkrYhZ4WS9dDjdi662nPYZ9MpmUXwdkmNEfqJNiVUK2XoGFcsomFRS82nQXjLXRx1Yje7caAL6s4nai2y18ZvoBC27khgrUgThnmVv'
//     const xpub3 = 'tpubD6NzVbkrYhZ4YXLo2beF97iKHXqrj8KaVrD1VnqAqyHr5urcoY6tVTJaM17jSVg5pGmrJTu5H9WuatB1cGBF4XQSeNzmm4D56BsBqnkN3vk'

//     const pubKeyBuffers = [xpub1, xpub2, xpub3].map((key: string) => {
//       return bitcoinjsLib.HDNode.fromBase58(key, bitcoinjsLib.networks.testnet).getPublicKeyBuffer()
//     })

//     const { address } = generateDerivedMultisigAddress(
//       [xpub1, xpub2, xpub3], 'testnet'
//     )

//     // @ts-ignore
//     backendApi.getWalletUnspents = jest.fn(() => {
//       return Promise.resolve([
//         {
//           txId,
//           txIdx,
//           address,
//           txAmount,
//           path: '0/0'
//         }
//       ])
//     })

//     // @ts-ignore
//     backendApi.getWallet = jest.fn(() => {
//       return Promise.resolve({
//         pubKeys: [xpub1, xpub2, xpub3]
//       })
//     })

//     // @ts-ignore
//     backendApi.getNewChangeAddress = jest.fn(() => {
//       return Promise.resolve('2Muk5nSmkQaJuAhKRVSSdTz9UfRfw5jCXkg')
//     })

//     const { transactionHex, status } = await transaction.sendCoins({
//       walletId: '13',
//       userToken: '1234',
//       walletPassphrase: 'abcd',
//       recipents: [{
//         address: '2NBMEXpkWZ4Fj1yHbQGgrzHLq2q7Z3nhfJK',
//         amount: 5000
//       }],
//       xprv: xprv1
//     }, 'testnet')

//     const tx = bitcoinjsLib.Transaction.fromHex(transactionHex)
//     const txb = bitcoinjsLib.TransactionBuilder.fromTransaction(tx, bitcoinjsLib.networks.testnet)

//     // should be able to sign with other keys without errors
//     txb.sign(0, bitcoinjsLib.HDNode.fromBase58(xprv2, bitcoinjsLib.networks.testnet).keyPair, redeemScript)

//     const hex = txb.build().toHex()

//     console.log(hex)
//     console.log(address)
//   })
// })
