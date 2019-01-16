import { expect, use, assert } from 'chai'

import * as transaction from '../transaction'
import { generateNewKeyPair, deriveKey, deriveKeyPair } from '../key'
import { generateNewMultisigAddress } from '../address'
import { txFromHex, txBuilderFromTx } from '../bitcoin'
import * as config from '../config'
import { ROOT_DERIVATION_PATH, SUPPORTED_NETWORKS } from '../constants'
import BigNumber from "bignumber.js";
import chaiBigNumber from 'chai-bignumber'
import chaiAsPromised from 'chai-as-promised'
import { encrypt } from '../crypto';
import { stubGetWallet, stubUnspents, createPath, stubSendTx, stubCreateAddress, stubFeesRates, stubGetKey } from './backend-stub';
import { KeyType } from '../../types/domain'

beforeEach(() => {
  // @ts-ignore
  config.network = SUPPORTED_NETWORKS.bitcoin
  use(chaiBigNumber(BigNumber))
  use(chaiAsPromised)
  // mocks
  // @ts-ignore
  stubCreateAddress('3DS7Y6bdePdnFCoXqddkevovh4s5M8NhgM')
})

describe('sendCoins', () => {
  stubFeesRates(5)
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
    ], '2/0/0')

    stubUnspents({
      change: 1.9,
      serviceFee: {
        amount: '0.09',
        address: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN'
      },
      outputs: [
        {
          address,
          txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          n: 0,
          path: createPath(2, 0, 0),
          amount: new BigNumber('700000000')
        }
      ]
    })

    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)
    const sendTxMock = stubSendTx()

    await transaction.sendCoins(
      '1234',
      '13',
      [{
        address: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN',
        amount: new BigNumber('500000000')
      }],
      userKeyPair.prvKey!,
    )

    const [, , transactionHex] = sendTxMock.mock.calls[0]

    const serverECPair = deriveKey(serverKeyPair.prvKey!, '2/0/0').keyPair
    const userECPair = deriveKey(userKeyPair.prvKey!, '2/0/0').keyPair
    const anotherECPair = deriveKey(anotherKeyPair.prvKey!, '2/0/0').keyPair

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

    expect(tx.outs.length).to.be.eq(3)
    expect(tx.ins.length).to.be.eq(1)
  })

  it('should throw error when neither password nor xprv are specified', async () => {
    // generates keyPairs and address
    const userKeyPair = generateNewKeyPair()
    const backupKeyPair = generateNewKeyPair()
    const serverKeyPair = generateNewKeyPair()

    stubUnspents({
      change: 1.9,
      serviceFee: {
        amount: '0.09',
        address: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN'
      },
      outputs: [
        {
          address: '',
          txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          n: 0,
          path: {
            cosignerIndex: 2,
            change: 0,
            addressIndex: 0
          },
          amount: new BigNumber('700000000')
        }
      ]
    })

    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)

    await assert.isRejected(transaction.sendCoins(
      '1234',
      '13',
      [{
        address: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN',
        amount: new BigNumber('500000000')
      }],
    ), "Password or xprv has to be specified!")
  })

  it('should throw error when there is no private key on server', async () => {
    // generates keyPairs and address
    const userKeyPair = generateNewKeyPair()
    const backupKeyPair = generateNewKeyPair()
    const serverKeyPair = generateNewKeyPair()

    const { address } = generateNewMultisigAddress([
      userKeyPair.pubKey,
      backupKeyPair.pubKey,
      serverKeyPair.pubKey
    ], '2/0/0')

    // @ts-ignore
    stubUnspents({
      change: 1.9,
      serviceFee: {
        amount: '0.09',
        address: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN'
      },
      outputs: [
        {
          address,
          txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          n: 0,
          path: createPath(2, 0, 0),
          amount: new BigNumber('700000000')
        }
      ]
    })

    stubGetKey({ id: '1', pubKey: 'pubKey', keyType: KeyType.USER, created: 'date' })
    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)

    await assert.isRejected(transaction.sendCoins(
      '1234',
      '13',
      [{
        address: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN',
        amount: new BigNumber('500000000')
      }],
      undefined,
      "secretPassword"
    ), "There is no private key on server!")
  })

  it('should get private key from server and decode it when password provided', async () => {
    // generates keyPairs and address
    const userKeyPair = generateNewKeyPair()
    const backupKeyPair = generateNewKeyPair()
    const serverKeyPair = generateNewKeyPair()

    const { address } = generateNewMultisigAddress([
      userKeyPair.pubKey,
      backupKeyPair.pubKey,
      serverKeyPair.pubKey
    ], '2/0/0')

    stubUnspents({
      change: 1.9,
      serviceFee: {
        amount: '0.09',
        address: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN'
      },
      outputs: [
        {
          address,
          txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          n: 0,
          path: createPath(2, 0, 0),
          amount: new BigNumber('700000000')
        }
      ]
    })
    const encryptedXprv = encrypt("secretPassword", userKeyPair.prvKey!)

    stubGetKey({ id: '1', pubKey: 'pubKey', keyType: KeyType.USER, prvKey: encryptedXprv, created: 'date' })
    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)
    stubSendTx()

    await transaction.sendCoins(
      '1234',
      '13',
      [{
        address: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN',
        amount: new BigNumber('500000000')
      }],
      undefined,
      "secretPassword"
    )
  })

  it('should send coins to testnet', async () => {
    // @ts-ignore
    config.network = SUPPORTED_NETWORKS.testnet
    stubCreateAddress('2NEUaAjCuGc2M7YnzyrkvkE6LH1fx3M89Zi')

    // generates keyPairs and address
    const userKeyPair = generateNewKeyPair()
    const backupKeyPair = generateNewKeyPair()
    const serverKeyPair = generateNewKeyPair()
    const anotherKeyPair = generateNewKeyPair()

    const { address, redeemScript } = generateNewMultisigAddress([
      userKeyPair.pubKey,
      backupKeyPair.pubKey,
      serverKeyPair.pubKey
    ], '2/0/0')

    stubUnspents({
      change: 1.9,
      serviceFee: {
        amount: 0.09,
        address: '2NEUaAjCuGc2M7YnzyrkvkE6LH1fx3M89Zi'
      },
      outputs: [
        {
          address,
          txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          n: 0,
          path: createPath(2, 0, 0),
          amount: '700000000'
        }
      ]
    })

    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)
    const sendTxMock = stubSendTx()

    await transaction.sendCoins(
      '1234',
      '13',
      [{
        address: '2NEUaAjCuGc2M7YnzyrkvkE6LH1fx3M89Zi',
        amount: new BigNumber('500000000')
      }],
      userKeyPair.prvKey!,
    )

    const [, , transactionHex] = sendTxMock.mock.calls[0]

    const serverECPair = deriveKey(serverKeyPair.prvKey!, '2/0/0').keyPair
    const userECPair = deriveKey(userKeyPair.prvKey!, '2/0/0').keyPair
    const anotherECPair = deriveKey(anotherKeyPair.prvKey!, '2/0/0').keyPair

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

    expect(tx.outs.length).to.be.eq(3)
    expect(tx.ins.length).to.be.eq(1)
  })

  it('should sort inputs and outputs lexicographically', async () => {
    // generates keyPairs and address
    const userKeyPair = generateNewKeyPair()
    const backupKeyPair = generateNewKeyPair()
    const serverKeyPair = generateNewKeyPair()

    const { address } = generateNewMultisigAddress([
      userKeyPair.pubKey,
      backupKeyPair.pubKey,
      serverKeyPair.pubKey
    ], '2/0/0')

    stubUnspents({
      change: 1.9,
      serviceFee: {
        amount: 0.09,
        address: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN'
      },
      outputs: [
        {
          address,
          txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          n: 1,
          path: createPath(2, 0, 0),
          amount: '650000000'
        },
        {
          address,
          txHash: '10be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          n: 0,
          path: createPath(2, 0, 0),
          amount: '50000000'
        }
      ]
    })
    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)
    const sendTxMock = stubSendTx()

    await transaction.sendCoins(
      '1234',
      '13',
      [
        {
          address: '3DS7Y6bdePdnFCoXqddkevovh4s5M8NhgM',
          amount: new BigNumber('500000000')
        },
        {
          address: '3DS7Y6bdePdnFCoXqddkevovh4s5M8NhgM',
          amount: new BigNumber('1500')
        }
      ],
      userKeyPair.prvKey!,
    )

    const [, , transactionHex] = sendTxMock.mock.calls[0]
    const tx = transaction.decodeTransaction(transactionHex)

    expect(tx.outputs.length).to.be.eq(4)
    expect(tx.inputs.length).to.be.eq(2)
    expect(tx.inputs[0].txHash < tx.inputs[1].txHash).to.be.eq(true)
    expect(tx.outputs[0].amount.isLessThan(tx.outputs[1].amount)).to.be.true
    expect(tx.outputs[1].amount.isLessThan(tx.outputs[2].amount)).to.be.true
  })

  it('should have only two outputs when api does not return serviceFee details', async () => {
    // @ts-ignore
    config.network = SUPPORTED_NETWORKS.testnet
    stubCreateAddress('2NEUaAjCuGc2M7YnzyrkvkE6LH1fx3M89Zi')

    // generates keyPairs and address
    const userKeyPair = generateNewKeyPair()
    const backupKeyPair = generateNewKeyPair()
    const serverKeyPair = generateNewKeyPair()
    const anotherKeyPair = generateNewKeyPair()

    const { address, redeemScript } = generateNewMultisigAddress([
      userKeyPair.pubKey,
      backupKeyPair.pubKey,
      serverKeyPair.pubKey
    ], '2/0/0')

    stubUnspents({
      change: 1.9,
      outputs: [
        {
          address,
          txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          n: 0,
          path: createPath(2, 0, 0),
          amount: 700000000
        }
      ]
    })

    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)
    const sendTxMock = stubSendTx()

    await transaction.sendCoins(
      '1234',
      '13',
      [{
        address: '2NEUaAjCuGc2M7YnzyrkvkE6LH1fx3M89Zi',
        amount: new BigNumber('500000000')
      }],
      userKeyPair.prvKey!,
    )

    const [, , transactionHex] = sendTxMock.mock.calls[0]

    const serverECPair = deriveKey(serverKeyPair.prvKey!, '2/0/0').keyPair
    const userECPair = deriveKey(userKeyPair.prvKey!, '2/0/0').keyPair
    const anotherECPair = deriveKey(anotherKeyPair.prvKey!, '2/0/0').keyPair

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
    ], '2/0/0')

    stubUnspents({
        change: 1.9,
        serviceFee: {
          amount: 0.09,
          address: '3DS7Y6bdePdnFCoXqddkevovh4s5M8NhgM'
        },
        outputs: [
          {
            address,
            txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
            n: 0,
            path: createPath(2, 0, 0),
            amount: 700000000
          }
        ]
      })
    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)
    const sendTxMock = stubSendTx()

    await transaction.sendCoins(
      '1234',
      '13',
      [
        {
          address: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN',
          amount: new BigNumber('500000000')
        },
        {
          address: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN',
          amount: new BigNumber('1500')
        }
      ],
      userKeyPair.prvKey!,
    )

    const [, , transactionHex] = sendTxMock.mock.calls[0]
    const tx = txFromHex(transactionHex)

    expect(tx.outs.length).to.be.eq(4)
    expect(tx.ins.length).to.be.eq(1)
  })
})

describe('decodeTransaction', () => {
  it('shoud exist', () => {
    expect(transaction.decodeTransaction).to.be.a('function')
  })

  it('shoud decode transaction', () => {
    const txHex = '0100000001145bb243544451ead3b8694a9597dc5e93583c0172ca16a2f2c74c8fd698be1102000000b40047304402205d30d1796f373290e554284fd333e3ea287709063b0461dae4577b2180787e980220121677e33785cc82b26b6a2146a34a759d15e5194dcf84c93db24e9ebcc6e374014c6952210214d16a77e4ddaa07d6dbef0ea757ea5d56f26b9bfc85534227004005c4ce102b2103e7cd55f382bcf7269dd813edd445d67de5c729b543bb20e31073ed835f661e322102c292a1d33bb482d6ab53a7328c0d0211808a785cc8769a9ac01cb3550144f37b53aeffffffff020065cd1d000000001976a914ff1cb7a5b23491534c66e7638f56d852ad47542288acf6bceb0b0000000017a91480cff499983050ec4268d749a1f898bec53e9fc28700000000'
    const changeAddress = '3DS7Y6bdePdnFCoXqddkevovh4s5M8NhgM'
    const changeAmount = new BigNumber('199998710')
    const recipientAddress = '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN'
    const sentAmount = new BigNumber('500000000')
    const utxoTxHash = '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14'
    const utxoTxId = 2

    const result = transaction.decodeTransaction(txHex)

    expect(result).to.haveOwnProperty('outputs')
    expect(result).to.haveOwnProperty('inputs')
    expect(result.outputs[0]).to.haveOwnProperty('amount')
    expect(result.outputs[0]).to.haveOwnProperty('address')
    expect(result.inputs[0]).to.haveOwnProperty('txHash')
    expect(result.inputs[0]).to.haveOwnProperty('n')
    expect(result.inputs).to.have.lengthOf(1)
    expect(result.outputs).to.have.lengthOf(2)
    // @ts-ignore
    expect(result.outputs[0].amount).to.be.bignumber.eq(sentAmount)
    expect(result.outputs[0].address).to.eq(recipientAddress)
    // @ts-ignore
    expect(result.outputs[1].amount).to.be.bignumber.eq(changeAmount)
    expect(result.outputs[1].address).to.eq(changeAddress)
    expect(result.inputs[0].txHash).to.eq(utxoTxHash)
    expect(result.inputs[0].n).to.eq(utxoTxId)
  })
})

describe('signTransaction', () => {
  it('shoud exist', () => {
    expect(transaction.signTransaction).to.be.a('function')
  })

  it('should sign transaction', () => {
    const xprv = 'xprv9s21ZrQH143K4UVYCa2N59SDjavhZSqV2vjQYUJzV5tq4rpJNo2BjKvin1vcwFzfENabiU5eiPiXVKCsBxjNSZyQBjT36EEN4spgL1uvrTs'
    const wrongXprv = 'xprv9s21ZrQH143K42jAsj3CsRB16Eh9MeN8SfKuiY23Aa33f2LEcVbDzBTn5QjtT83mr4wJ5LxHTMoU2DcqGVQwxrvorJJnDUL5YgQG7x2yP5c'
    const txHex = '0100000001145bb243544451ead3b8694a9597dc5e93583c0172ca16a2f2c74c8fd698be1100000000b5004830450221009f71f64142b1381e0ccdf2b868310b1b62bb57b3de4aca0554c03c881927be0a0220236412b2c299a1fd34d1a5b1b134b5fe5f3b479bb0fb29221447adb68effb48f014c6952210317b3b652ead4367b83303c377e4b2000b707f43694a17122bd65484f9f9e76ad2102251b99fde4b9d855d6afd1782c769988f9c39fa748a90b5e8b126fb208d834302103f16c3c588e2c29d8987842823e6cf326178e60650ebc613c3fab28afc16ffc4a53aeffffffff030065cd1d000000001976a914ff1cb7a5b23491534c66e7638f56d852ad47542288ac802b530b0000000017a91480cff499983050ec4268d749a1f898bec53e9fc28740548900000000001976a914ff1cb7a5b23491534c66e7638f56d852ad47542288ac00000000'
    const unspents = [
      {
        txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
        n: 0,
        path: createPath(2, 0, 0),
        value: new BigNumber('700000000'),
        address: '32kvV8MVm7JFocWg4YL6e97YeaxKxiD5F9'
      }
    ]

    const result = transaction.signTransaction(xprv, txHex, unspents)
    expect(result.txHex).to.not.eq(txHex)

    expect(() => {
      transaction.signTransaction(wrongXprv, txHex, unspents)
    }).to.throw('Key pair cannot sign for this input')

    expect(() => {
      transaction.signTransaction(xprv, result.txHex, unspents)
    }).to.throw('Signature already exists')
  })
})

describe('sendCoins and signTransaction', () => {
  it('should send coins to testnet and signTransaction', async () => {
    // @ts-ignore
    config.network = SUPPORTED_NETWORKS.testnet
    stubCreateAddress('2NEUaAjCuGc2M7YnzyrkvkE6LH1fx3M89Zi')

    // generates keyPairs and address
    const userKeyPair = deriveKeyPair(generateNewKeyPair(), ROOT_DERIVATION_PATH)
    const backupKeyPair = deriveKeyPair(generateNewKeyPair(), ROOT_DERIVATION_PATH)
    const serverKeyPair = deriveKeyPair(generateNewKeyPair(), ROOT_DERIVATION_PATH)

    const { address } = generateNewMultisigAddress([
      userKeyPair.pubKey,
      backupKeyPair.pubKey,
      serverKeyPair.pubKey
    ], '2/1/0')

    const unspents = [
      {
        address,
        txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
        n: 0,
        path: createPath(2, 0, 1),
        amount: new BigNumber('700000000')
      }
    ];
    stubUnspents({
        change: 1.9,
        serviceFee: {
          amount: 0.09,
          address: '2NEUaAjCuGc2M7YnzyrkvkE6LH1fx3M89Zi'
        },
        outputs: unspents
      })
    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)
    const sendTxMock = stubSendTx()

    await transaction.sendCoins(
      '1234',
      '13',
      [{
        address: '2NEUaAjCuGc2M7YnzyrkvkE6LH1fx3M89Zi',
        amount: new BigNumber('500000000')
      }],
      userKeyPair.prvKey!,
    )

    const [, , transactionHex] = sendTxMock.mock.calls[0]

    const { txHex, txHash } = transaction.signTransaction(serverKeyPair.prvKey!, transactionHex, unspents);
    expect(txHash).to.not.eq('')
    expect(txHex).to.not.eq('')
  })
})

