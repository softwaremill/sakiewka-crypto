import { expect } from 'chai'

import * as transaction from '../transaction'
import * as backendApi from '../backend-api'
import * as fees from '../utils/fees'
import { generateNewKeyPair, deriveKey } from '../key'
import { generateNewMultisigAddress } from '../address'
import {
  txFromHex, txBuilderFromTx
} from '../bitcoin'
import * as config from '../config'
import { encrypt } from '../crypto'

beforeEach(() => {
  // @ts-ignore
  config.network = 'bitcoin'

  // mocks
  // @ts-ignore
  backendApi.createNewAddress = jest.fn(() => {
    return Promise.resolve({
      address: '3DS7Y6bdePdnFCoXqddkevovh4s5M8NhgM'
    })
  })
})

describe('sendCoins', () => {

  // @ts-ignore
  fees.getRecommendedFee = jest.fn(() => {
    return Promise.resolve(5)
  })

  it('should exist', () => {
    expect(transaction.sendCoins).to.be.a('function')
  })

  it('should send coins', async () => {
    // generates keyPairs and address
    const userKeyPair = generateNewKeyPair()
    const backupKeyPair = generateNewKeyPair()
    const serverKeyPair = generateNewKeyPair()
    const anotherKeyPair = generateNewKeyPair()

    const { address, redeemScript } = generateNewMultisigAddress([
      userKeyPair.pubKey,
      backupKeyPair.pubKey,
      serverKeyPair.pubKey
    ], '0/0')

    // @ts-ignore
    backendApi.listUnspents = jest.fn(() => {
      return Promise.resolve({
        data: {
          unspents: [
            {
              address,
              txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
              index: 0,
              path: '0/0',
              value: 700000000
            }
          ]
        }
      })
    })

    // @ts-ignore
    backendApi.getWallet = jest.fn(() => {
      return Promise.resolve({
        pubKeys: [
          userKeyPair.pubKey,
          backupKeyPair.pubKey,
          serverKeyPair.pubKey
        ]
      })
    })

    const { transactionHex, status } = await transaction.sendCoins(
      '1234',
      userKeyPair.prvKey,
      '13',
      [{
        address: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN',
        value: 500000000
      }]
    )

    const serverECPair = deriveKey(serverKeyPair.prvKey, '0/0').keyPair
    const userECPair = deriveKey(userKeyPair.prvKey, '0/0').keyPair
    const anotherECPair = deriveKey(anotherKeyPair.prvKey, '0/0').keyPair

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

  it('should send coins to testnet', async () => {
    // @ts-ignore
    config.network = 'testnet'

    // @ts-ignore
    backendApi.createNewAddress = jest.fn(() => {
      return Promise.resolve({
        address: '2NEUaAjCuGc2M7YnzyrkvkE6LH1fx3M89Zi'
      })
    })

    // generates keyPairs and address
    const userKeyPair = generateNewKeyPair()
    const backupKeyPair = generateNewKeyPair()
    const serverKeyPair = generateNewKeyPair()
    const anotherKeyPair = generateNewKeyPair()

    const { address, redeemScript } = generateNewMultisigAddress([
      userKeyPair.pubKey,
      backupKeyPair.pubKey,
      serverKeyPair.pubKey
    ], '0/0')

    // @ts-ignore
    backendApi.listUnspents = jest.fn(() => {
      return Promise.resolve({
        data: {
          unspents: [
            {
              address,
              txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
              index: 0,
              path: '0/0',
              value: 700000000
            }
          ]
        }
      })
    })

    // @ts-ignore
    backendApi.getWallet = jest.fn(() => {
      return Promise.resolve({
        pubKeys: [
          userKeyPair.pubKey,
          backupKeyPair.pubKey,
          serverKeyPair.pubKey
        ]
      })
    })

    const { transactionHex, status } = await transaction.sendCoins(
      '1234',
      userKeyPair.prvKey,
      '13',
      [{
        address: '2NEUaAjCuGc2M7YnzyrkvkE6LH1fx3M89Zi',
        value: 500000000
      }]
    )

    const serverECPair = deriveKey(serverKeyPair.prvKey, '0/0').keyPair
    const userECPair = deriveKey(userKeyPair.prvKey, '0/0').keyPair
    const anotherECPair = deriveKey(anotherKeyPair.prvKey, '0/0').keyPair

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
    // generates keyPairs and address
    const userKeyPair = generateNewKeyPair()
    const backupKeyPair = generateNewKeyPair()
    const serverKeyPair = generateNewKeyPair()

    const { address } = generateNewMultisigAddress([
      userKeyPair.pubKey,
      backupKeyPair.pubKey,
      serverKeyPair.pubKey
    ], '')

    // mocks listUnspents
    // @ts-ignore
    backendApi.listUnspents = jest.fn(() => {
      return Promise.resolve({
        data: {
          unspents: [
            {
              address,
              txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
              index: 0,
              path: '0/0',
              value: 700000000
            }
          ]
        }
      })
    })

    // mocks getWallet
    // @ts-ignore
    backendApi.getWallet = jest.fn(() => {
      return Promise.resolve({
        pubKeys: [
          userKeyPair.pubKey,
          backupKeyPair.pubKey,
          serverKeyPair.pubKey
        ]
      })
    })

    // mocks createNewAddress
    // @ts-ignore
    backendApi.createNewAddress = jest.fn(() => {
      return Promise.resolve({
        address: '3DS7Y6bdePdnFCoXqddkevovh4s5M8NhgM'
      })
    })

    const { transactionHex, status } = await transaction.sendCoins(
      '1234',
      userKeyPair.prvKey,
      '13',
      [
        {
          address: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN',
          value: 500000000
        },
        {
          address: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN',
          value: 1500
        }
      ]
    )

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
      { value: 14, address: 'asda', txHash: 'asda', index: 0, path: '0/0' },
      { value: 2, address: 'asda', txHash: 'asda', index: 0, path: '0/0' },
      { value: 9, address: 'asda', txHash: 'asda', index: 0, path: '0/0' }
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
      { address: '', value: 13211 },
      { address: '', value: 98 },
      { address: '', value: 989 }
    ])
    expect(result).to.eq(14298)
  })
})

describe('decodeTransaction', () => {
  it('shoud exist', () => {
    expect(transaction.decodeTransaction).to.be.a('function')
  })

  it('shoud decode transaction', () => {
    const txHex = '0100000001145bb243544451ead3b8694a9597dc5e93583c0172ca16a2f2c74c8fd698be1102000000b40047304402205d30d1796f373290e554284fd333e3ea287709063b0461dae4577b2180787e980220121677e33785cc82b26b6a2146a34a759d15e5194dcf84c93db24e9ebcc6e374014c6952210214d16a77e4ddaa07d6dbef0ea757ea5d56f26b9bfc85534227004005c4ce102b2103e7cd55f382bcf7269dd813edd445d67de5c729b543bb20e31073ed835f661e322102c292a1d33bb482d6ab53a7328c0d0211808a785cc8769a9ac01cb3550144f37b53aeffffffff020065cd1d000000001976a914ff1cb7a5b23491534c66e7638f56d852ad47542288acf6bceb0b0000000017a91480cff499983050ec4268d749a1f898bec53e9fc28700000000'
    const changeAddress = '3DS7Y6bdePdnFCoXqddkevovh4s5M8NhgM'
    const changeAmount = 199998710
    const recipientAddress = '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN'
    const sentAmount = 500000000
    const utxoTxHash = '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14'
    const utxoTxId = 2

    const result = transaction.decodeTransaction(txHex)

    expect(result).to.haveOwnProperty('outputs')
    expect(result).to.haveOwnProperty('inputs')
    expect(result.outputs[0]).to.haveOwnProperty('value')
    expect(result.outputs[0]).to.haveOwnProperty('address')
    expect(result.inputs[0]).to.haveOwnProperty('txHash')
    expect(result.inputs[0]).to.haveOwnProperty('index')
    expect(result.inputs).to.have.lengthOf(1)
    expect(result.outputs).to.have.lengthOf(2)
    expect(result.outputs[0].value).to.eq(sentAmount)
    expect(result.outputs[0].address).to.eq(recipientAddress)
    expect(result.outputs[1].value).to.eq(changeAmount)
    expect(result.outputs[1].address).to.eq(changeAddress)
    expect(result.inputs[0].txHash).to.eq(utxoTxHash)
    expect(result.inputs[0].index).to.eq(utxoTxId)
  })
})

describe('signTransaction', () => {
  it('shoud exist', () => {
    expect(transaction.signTransaction).to.be.a('function')
  })

  it('should sign transaction', () => {
    process.env.SERVICE_PASSPHRASE = 'abcd'
    const xprv = 'xprv9s21ZrQH143K3KLHzzecwwCc81ixH1h1eXxtXjUvdmkfYbiexDWU8oc6jRwe6j3CUs78FzeXbZdxZVQwzQ6GnhAPV6JX1gv5EpRG8DnwJjU'
    const wrongXprv = 'xprv9s21ZrQH143K42jAsj3CsRB16Eh9MeN8SfKuiY23Aa33f2LEcVbDzBTn5QjtT83mr4wJ5LxHTMoU2DcqGVQwxrvorJJnDUL5YgQG7x2yP5c'
    const txHex = '0100000001145bb243544451ead3b8694a9597dc5e93583c0172ca16a2f2c74c8fd698be1100000000b40047304402200d84392644bf0754528d5ea9af4ec450646fd2e37afc2a1024550e84729e6ed20220133b336b034b316869bfb7aac691d11171107a4dceed4b8fc7e09f33a1978008014c695221039f00f0d74d4cc9237fefa63f7c3548e173c17b54928aaca4351d5010614efc812103fb6e4d3144af2f90afe2bdda5d59394dadd2a648c39154d5a2d6da1334911e522102bf1f0bc00d3f001cb67a5581511cc498ece4de346fdae0b0e5c96de77509596f53aeffffffff020065cd1d000000001976a914ff1cb7a5b23491534c66e7638f56d852ad47542288acf6bceb0b0000000017a91480cff499983050ec4268d749a1f898bec53e9fc28700000000'
    const unspents = [
      {
        txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
        index: 0,
        path: '0/0',
        value: 700000000,
        address: '39qBvnnAEv42EEYQEC6hqvTU42b24Mj9wX'
      }
    ]

    const result = transaction.signTransaction(encrypt(process.env.SERVICE_PASSPHRASE, xprv), txHex, unspents)
    expect(result.txHex).to.not.eq(txHex)

    expect(() => {
      transaction.signTransaction(encrypt(process.env.SERVICE_PASSPHRASE, wrongXprv), txHex, unspents)
    }).to.throw('Key pair cannot sign for this input')

    expect(() => {
      transaction.signTransaction(encrypt(process.env.SERVICE_PASSPHRASE, xprv), result.txHex, unspents)
    }).to.throw('Signature already exists')
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
//     backendApi.listUnspents = jest.fn(() => {
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
//     backendApi.createNewAddress = jest.fn(() => {
//       return Promise.resolve('2Muk5nSmkQaJuAhKRVSSdTz9UfRfw5jCXkg')
//     })

//     const { transactionHex, status } = await transaction.sendCoins({
//       walletId: '13',
//       userToken: '1234',
//       walletPassphrase: 'abcd',
//       recipents: [{
//         address: '2NBMEXpkWZ4Fj1yHbQGgrzHLq2q7Z3nhfJK',
//         value: 5000
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
