import { expect, use } from 'chai'

import transactionModuleFactory from '../transaction'
import keyModuleFactory from '../key'
import addressModuleFactory from '../address'
import bitcoinModuleFactory from '../bitcoin'
import * as config from '../config'
import { ROOT_DERIVATION_PATH, SUPPORTED_NETWORKS, API_ERROR } from '../constants'
import BigNumber from "bignumber.js";
import chaiBigNumber from 'chai-bignumber'
import chaiAsPromised from 'chai-as-promised'
import { encrypt } from '../crypto';
import {
  stubGetWallet,
  stubUnspents,
  createPath,
  stubSendTx,
  stubCreateAddress,
  stubFeesRates,
  stubGetKey
} from './backend-stub';
import { Currency, KeyType, UTXO } from '../../types/domain'
import { currency } from "./helpers";
import { Transaction } from "bitcoinjs-lib";

const keyModule = keyModuleFactory(currency)
const addressModule = addressModuleFactory(currency)
const bitcoinModule = bitcoinModuleFactory(currency)

const transactionModuleWithStubbedApiCalls = () => transactionModuleFactory(currency)
const changeAddress = currency == Currency.BTG ? 'ATWyG3xpRdyYy1K6HBdVPBi629W4DNnB9m' : '3DS7Y6bdePdnFCoXqddkevovh4s5M8NhgM'
const serviceAddress = currency == Currency.BTG ? 'AWu3T7CWXXLxrHwuQ4tnHtubpdp1LHUZUK' : '3AnzyVbVSwfrre3vzQLwVMgZ34HH2Ja22d'
const destinationAddress = currency == Currency.BTG ? 'Gh6q8MweJFqU5nVuoS8TC4hmPsAJJEtVuA' : '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN'

const testnetChangeAddress = '2NEUaAjCuGc2M7YnzyrkvkE6LH1fx3M89Zi'
const testnetServiceAddress = '2Mw4fCozNRMZE95rJBk25J4MvRJzwkQyVxg'
const testnetDestinationAddress = '2Mt42Wi2JBbAc6Q4GXsxDWbkDTwaEQhqoEM'


beforeEach(() => {
  // @ts-ignore
  config.networkFactory = (c : Currency) => SUPPORTED_NETWORKS[c].mainnet
  use(chaiBigNumber(BigNumber))
  use(chaiAsPromised)
  // mocks
  // @ts-ignore
  stubCreateAddress(changeAddress)
})

describe('sendCoins', () => {
  stubFeesRates(5)
  it('should exist', () => {
    const transactionModule = transactionModuleWithStubbedApiCalls()
    expect(transactionModule.send).to.be.a('function')
  })

  it('should send coins', async () => {
    // generates keyPairs and address
    const inputValue = new BigNumber('7')
    const inputValueSatoshi = 700000000
    const userKeyPair = keyModule.generateNewKeyPair()
    const backupKeyPair = keyModule.generateNewKeyPair()
    const serverKeyPair = keyModule.generateNewKeyPair()
    const anotherKeyPair = keyModule.generateNewKeyPair()
    const { address, redeemScript } = addressModule.generateNewMultisigAddress([
      userKeyPair.pubKey,
      backupKeyPair.pubKey,
      serverKeyPair.pubKey
    ], '2/0/0')
    stubUnspents({
      change: 1.9,
      serviceFee: {
        amount: '0.09',
        address: destinationAddress
      },
      outputs: [
        {
          address,
          txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          n: 0,
          path: createPath(2, 0, 0),
          amount: inputValue
        }
      ]
    })
    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)
    const sendTxMock = stubSendTx()

    const transactionModule = transactionModuleWithStubbedApiCalls()

    await transactionModule.send(
      '1234',
      '13',
      [{
        address: destinationAddress,
        amount: new BigNumber('5'),
      }, {
        address,
        amount: new BigNumber('1.99990000')
      }],
      userKeyPair.prvKey!,
    )

    const [, , transactionHex] = sendTxMock.mock.calls[0]

    const serverECPair = keyModule.deriveKey(serverKeyPair.prvKey!, '2/0/0').keyPair
    const userECPair = keyModule.deriveKey(userKeyPair.prvKey!, '2/0/0').keyPair
    const anotherECPair = keyModule.deriveKey(anotherKeyPair.prvKey!, '2/0/0').keyPair

    // recreates transaction builder
    const tx = bitcoinModule.txFromHex(transactionHex)
    // @ts-ignore
    tx.ins[0].value = inputValueSatoshi
    const txb = bitcoinModule.txBuilderFromTx(tx)

    // should be able to sign with other keys without errors
    // @ts-ignore
    const hashType = currency == Currency.BTG ? (Transaction.SIGHASH_ALL | Transaction.SIGHASH_FORKID) : Transaction.SIGHASH_ALL
    txb.sign(0, serverECPair, redeemScript, hashType, inputValueSatoshi)

    // signing again or using wrong key should throw errors
    expect(() => {
      txb.sign(0, userECPair, redeemScript, hashType, inputValueSatoshi)
    }).to.throw('Signature already exists')

    expect(() => {
      txb.sign(0, anotherECPair, redeemScript, hashType, inputValueSatoshi)
    }).to.throw('Key pair cannot sign for this input')

    expect(tx.outs.length).to.be.eq(4)
    expect(tx.ins.length).to.be.eq(1)
  })

  it('should throw error when neither password nor xprv are specified', async () => {
    // generates keyPairs and address
    const userKeyPair = keyModule.generateNewKeyPair()
    const backupKeyPair = keyModule.generateNewKeyPair()
    const serverKeyPair = keyModule.generateNewKeyPair()

    stubUnspents({
      change: 1.9,
      serviceFee: {
        amount: '0.09',
        address: serviceAddress
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
          amount: new BigNumber('7')
        }
      ]
    })
    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)

    const transactionModule = transactionModuleWithStubbedApiCalls()

    const promise = transactionModule.send('1234', '13', [{
      address: serviceAddress,
      amount: new BigNumber('5')
    }]);
    await expect(promise).to.eventually.be.rejected
      .and.have.property('errors')
      .that.include(API_ERROR.XPRIV_OR_PASSWORD_REQUIRED.errors[0])
  })

  it('should throw error when there is no private key on server', async () => {
    // generates keyPairs and address
    const userKeyPair = keyModule.generateNewKeyPair()
    const backupKeyPair = keyModule.generateNewKeyPair()
    const serverKeyPair = keyModule.generateNewKeyPair()
    const { address } = addressModule.generateNewMultisigAddress([
      userKeyPair.pubKey,
      backupKeyPair.pubKey,
      serverKeyPair.pubKey
    ], '2/0/0')
    // @ts-ignore
    stubUnspents({
      change: 1.9,
      serviceFee: {
        amount: '0.09',
        address: serviceAddress
      },
      outputs: [
        {
          address,
          txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          n: 0,
          path: createPath(2, 0, 0),
          amount: new BigNumber('7')
        }
      ]
    })

    stubGetKey({ id: '1', pubKey: 'pubKey', keyType: KeyType.USER, created: 'date' })
    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)


    const transactionModule = transactionModuleWithStubbedApiCalls()

    const promise = transactionModule.send('1234', '13', [{
      address: destinationAddress,
      amount: new BigNumber('5')
    }], undefined, "secretPassword");

    await expect(promise).to.eventually.be.rejected
      .and.have.property('errors')
      .that.include(API_ERROR.NO_PRIV_KEY_ON_SERVER.errors[0])
  })

  it('should get private key from server and decode it when password provided', async () => {
    // generates keyPairs and address
    const userKeyPair = keyModule.generateNewKeyPair()
    const backupKeyPair = keyModule.generateNewKeyPair()
    const serverKeyPair = keyModule.generateNewKeyPair()

    const { address } = addressModule.generateNewMultisigAddress([
      userKeyPair.pubKey,
      backupKeyPair.pubKey,
      serverKeyPair.pubKey
    ], '2/0/0')

    const inputValue = new BigNumber('7')
    stubUnspents({
      change: 1.9,
      serviceFee: {
        amount: '0.09',
        address: serviceAddress
      },
      outputs: [
        {
          address,
          txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          n: 0,
          path: createPath(2, 0, 0),
          amount: inputValue
        }
      ]
    })
    const encryptedXprv = encrypt("secretPassword", userKeyPair.prvKey!)

    stubGetKey({ id: '1', pubKey: 'pubKey', keyType: KeyType.USER, prvKey: encryptedXprv, created: 'date' })
    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)
    stubSendTx()

    const transactionModule = transactionModuleWithStubbedApiCalls()

    await transactionModule.send(
      '1234',
      '13',
      [{
        address: destinationAddress,
        amount: new BigNumber('5')
      },{
        address,
        amount: new BigNumber('1.99990000')
      }],
      undefined,
      "secretPassword"
    )
  })

  it('should return error when passphrase does not match', async () => {
    // generates keyPairs and address
    const userKeyPair = keyModule.generateNewKeyPair()
    const backupKeyPair = keyModule.generateNewKeyPair()
    const serverKeyPair = keyModule.generateNewKeyPair()

    const { address } = addressModule.generateNewMultisigAddress([
      userKeyPair.pubKey,
      backupKeyPair.pubKey,
      serverKeyPair.pubKey
    ], '2/0/0')

    stubUnspents({
      change: 1.9,
      serviceFee: {
        amount: '0.09',
        address: serviceAddress
      },
      outputs: [
        {
          address,
          txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          n: 0,
          path: createPath(2, 0, 0),
          amount: new BigNumber('7')
        }
      ]
    })
    const encryptedXprv = encrypt("secretPassword", userKeyPair.prvKey!)

    stubGetKey({ id: '1', pubKey: 'pubKey', keyType: KeyType.USER, prvKey: encryptedXprv, created: 'date' })
    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)
    stubSendTx()

    const transactionModule = transactionModuleWithStubbedApiCalls()

    const promise = transactionModule.send('1234', '13', [{
      address: destinationAddress,
      amount: new BigNumber('5')
    }], undefined, "otherPassword");

    await expect(promise).to.eventually.be.rejected
      .and.have.property('errors')
      .that.include(API_ERROR.INCORRECT_PASSPHRASE.errors[0])
  })

  it('should send coins to testnet', async () => {
    // @ts-ignore
    config.networkFactory = (c : Currency) => SUPPORTED_NETWORKS[c].testnet
    stubCreateAddress(testnetChangeAddress)

    // generates keyPairs and address

    const inputValue = new BigNumber('7')
    const inputValueSatoshi = 700000000
    const userKeyPair = keyModule.generateNewKeyPair()
    const backupKeyPair = keyModule.generateNewKeyPair()
    const serverKeyPair = keyModule.generateNewKeyPair()
    const anotherKeyPair = keyModule.generateNewKeyPair()

    const { address, redeemScript } = addressModule.generateNewMultisigAddress([
      userKeyPair.pubKey,
      backupKeyPair.pubKey,
      serverKeyPair.pubKey
    ], '2/0/0')

    stubUnspents({
      change: 1.9,
      serviceFee: {
        amount: 0.09,
        address: testnetServiceAddress
      },
      outputs: [
        {
          address,
          txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          n: 0,
          path: createPath(2, 0, 0),
          amount: inputValue
        }
      ]
    })

    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)
    const sendTxMock = stubSendTx()

    const transactionModule = transactionModuleWithStubbedApiCalls()

    await transactionModule.send(
      '1234',
      '13',
      [{
        address: testnetDestinationAddress,
        amount: new BigNumber('5')
      }, {
        address,
        amount: new BigNumber('1.99990000')
      }],
      userKeyPair.prvKey!,
    )

    const [, , transactionHex] = sendTxMock.mock.calls[0]

    const serverECPair = keyModule.deriveKey(serverKeyPair.prvKey!, '2/0/0').keyPair
    const userECPair = keyModule.deriveKey(userKeyPair.prvKey!, '2/0/0').keyPair
    const anotherECPair = keyModule.deriveKey(anotherKeyPair.prvKey!, '2/0/0').keyPair

    // recreates transaction builder
    const tx = bitcoinModule.txFromHex(transactionHex)
    //@ts-ignore
    tx.ins[0].value = inputValueSatoshi
    const txb = bitcoinModule.txBuilderFromTx(tx)

    // should be able to sign with other keys without errors

    //@ts-ignore
    const hashType = currency == Currency.BTG ? (Transaction.SIGHASH_ALL | Transaction.SIGHASH_FORKID) : Transaction.SIGHASH_ALL
    txb.sign(0, serverECPair, redeemScript, hashType, inputValueSatoshi)

    // signing again or using wrong key should throw errors
    expect(() => {
      txb.sign(0, userECPair, redeemScript, hashType, inputValueSatoshi)
    }).to.throw('Signature already exists')

    expect(() => {
      txb.sign(0, anotherECPair, redeemScript, hashType, inputValueSatoshi)
    }).to.throw('Key pair cannot sign for this input')

    expect(tx.outs.length).to.be.eq(4)
    expect(tx.ins.length).to.be.eq(1)
  })

  it('should sort inputs and outputs lexicographically', async () => {
    // generates keyPairs and address
    const userKeyPair = keyModule.generateNewKeyPair()
    const backupKeyPair = keyModule.generateNewKeyPair()
    const serverKeyPair = keyModule.generateNewKeyPair()

    const { address } = addressModule.generateNewMultisigAddress([
      userKeyPair.pubKey,
      backupKeyPair.pubKey,
      serverKeyPair.pubKey
    ], '2/0/0')

    stubUnspents({
      change: 1.9,
      serviceFee: {
        amount: 0.09,
        address: serviceAddress
      },
      outputs: [
        {
          address,
          txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          n: 1,
          path: createPath(2, 0, 0),
          amount: new BigNumber('6.5')
        },
        {
          address,
          txHash: '10be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          n: 0,
          path: createPath(2, 0, 0),
          amount: new BigNumber('0.5')
        }
      ]
    })
    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)
    const sendTxMock = stubSendTx()

    const transactionModule = transactionModuleWithStubbedApiCalls()

    await transactionModule.send(
      '1234',
      '13',
      [
        {
          address: destinationAddress,
          amount: new BigNumber('5')
        },
        {
          address: destinationAddress,
          amount: new BigNumber('1500')
        }
      ],
      userKeyPair.prvKey!,
    )

    const [, , transactionHex] = sendTxMock.mock.calls[0]
    const tx = transactionModule.decodeTransaction(transactionHex)

    expect(tx.outputs.length).to.be.eq(4)
    expect(tx.inputs.length).to.be.eq(2)
    expect(tx.inputs[0].txHash < tx.inputs[1].txHash).to.be.eq(true)
    expect(tx.outputs[0].amount.isLessThan(tx.outputs[1].amount)).to.be.true
    expect(tx.outputs[1].amount.isLessThan(tx.outputs[2].amount)).to.be.true
  })

  it('should have only three outputs when api does not return serviceFee details', async () => {
    // @ts-ignore
    config.networkFactory = (c : Currency) => SUPPORTED_NETWORKS[c].testnet
    stubCreateAddress(testnetChangeAddress)

    // generates keyPairs and address
    const userKeyPair = keyModule.generateNewKeyPair()
    const backupKeyPair = keyModule.generateNewKeyPair()
    const serverKeyPair = keyModule.generateNewKeyPair()
    const anotherKeyPair = keyModule.generateNewKeyPair()

    const { address, redeemScript } = addressModule.generateNewMultisigAddress([
      userKeyPair.pubKey,
      backupKeyPair.pubKey,
      serverKeyPair.pubKey
    ], '2/0/0')

    const inputValue = new BigNumber('7')
    const inputValueSatoshi = 700000000
    stubUnspents({
      change: 1.9,
      outputs: [
        {
          address,
          txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          n: 0,
          path: createPath(2, 0, 0),
          amount: inputValue
        }
      ]
    })

    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)
    const sendTxMock = stubSendTx()

    const transactionModule = transactionModuleWithStubbedApiCalls()

    await transactionModule.send(
      '1234',
      '13',
      [{
        address: testnetDestinationAddress,
        amount: new BigNumber('5')
      }, {
        address,
        amount: new BigNumber('1.99990000')
      }],
      userKeyPair.prvKey!,
    )

    const [, , transactionHex] = sendTxMock.mock.calls[0]

    const serverECPair = keyModule.deriveKey(serverKeyPair.prvKey!, '2/0/0').keyPair
    const userECPair = keyModule.deriveKey(userKeyPair.prvKey!, '2/0/0').keyPair
    const anotherECPair = keyModule.deriveKey(anotherKeyPair.prvKey!, '2/0/0').keyPair

    // recreates transaction builder
    const tx = bitcoinModule.txFromHex(transactionHex)
    //@ts-ignore
    tx.ins[0].value = inputValueSatoshi
    const txb = bitcoinModule.txBuilderFromTx(tx)

    // should be able to sign with other keys without errors

    //@ts-ignore
    const hashType = currency == Currency.BTG ? (Transaction.SIGHASH_ALL | Transaction.SIGHASH_FORKID) : Transaction.SIGHASH_ALL
    txb.sign(0, serverECPair, redeemScript, hashType, inputValueSatoshi)

    // signing again or using wrong key should throw errors
    expect(() => {
      txb.sign(0, userECPair, redeemScript, hashType, inputValueSatoshi)
    }).to.throw('Signature already exists')

    expect(() => {
      txb.sign(0, anotherECPair, redeemScript, hashType, inputValueSatoshi)
    }).to.throw('Key pair cannot sign for this input')

    expect(tx.outs.length).to.be.eq(3)
    expect(tx.ins.length).to.be.eq(1)
  })
})

describe('sendCoins to multiple outputs', () => {
  it('should exist', () => {
    const transactionModule = transactionModuleWithStubbedApiCalls()
    expect(transactionModule.send).to.be.a('function')
  })

  it('should send coins', async () => {
    // generates keyPairs and address
    const userKeyPair = keyModule.generateNewKeyPair()
    const backupKeyPair = keyModule.generateNewKeyPair()
    const serverKeyPair = keyModule.generateNewKeyPair()

    const { address } = addressModule.generateNewMultisigAddress([
      userKeyPair.pubKey,
      backupKeyPair.pubKey,
      serverKeyPair.pubKey
    ], '2/0/0')

    const inputValue = new BigNumber('7')
    stubUnspents({
      change: 1.9,
      serviceFee: {
        amount: 0.09,
        address: serviceAddress
      },
      outputs: [
        {
          address,
          txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          n: 0,
          path: createPath(2, 0, 0),
          amount: inputValue
        }
      ]
    })
    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)
    const sendTxMock = stubSendTx()

    const transactionModule = transactionModuleWithStubbedApiCalls()

    await transactionModule.send(
      '1234',
      '13',
      [
        {
          address: destinationAddress,
          amount: new BigNumber('5')
        },
        {
          address: destinationAddress,
          amount: new BigNumber('1500')
        },
        {
          address,
          amount: new BigNumber('1.99900000')
        },
      ],
      userKeyPair.prvKey!,
    )

    const [, , transactionHex] = sendTxMock.mock.calls[0]
    const tx = bitcoinModule.txFromHex(transactionHex)

    expect(tx.outs.length).to.be.eq(5)
    expect(tx.ins.length).to.be.eq(1)
  })
})

describe('decodeTransaction', () => {
  it('shoud exist', () => {
    const transactionModule = transactionModuleWithStubbedApiCalls()
    expect(transactionModule.decodeTransaction).to.be.a('function')
  })

  it('shoud decode transaction', () => {
    const txHex = '0100000001145bb243544451ead3b8694a9597dc5e93583c0172ca16a2f2c74c8fd698be1102000000b40047304402205d30d1796f373290e554284fd333e3ea287709063b0461dae4577b2180787e980220121677e33785cc82b26b6a2146a34a759d15e5194dcf84c93db24e9ebcc6e374014c6952210214d16a77e4ddaa07d6dbef0ea757ea5d56f26b9bfc85534227004005c4ce102b2103e7cd55f382bcf7269dd813edd445d67de5c729b543bb20e31073ed835f661e322102c292a1d33bb482d6ab53a7328c0d0211808a785cc8769a9ac01cb3550144f37b53aeffffffff020065cd1d000000001976a914ff1cb7a5b23491534c66e7638f56d852ad47542288acf6bceb0b0000000017a91480cff499983050ec4268d749a1f898bec53e9fc28700000000'
    const changeAmount = new BigNumber('1.99998710')
    const sentAmount = new BigNumber('5')
    const utxoTxHash = '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14'
    const utxoTxId = 2

    const transactionModule = transactionModuleWithStubbedApiCalls()

    const result = transactionModule.decodeTransaction(txHex)

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
    expect(result.outputs[0].address).to.eq(destinationAddress)
    // @ts-ignore
    expect(result.outputs[1].amount).to.be.bignumber.eq(changeAmount)
    expect(result.outputs[1].address).to.eq(changeAddress)
    expect(result.inputs[0].txHash).to.eq(utxoTxHash)
    expect(result.inputs[0].n).to.eq(utxoTxId)
  })
})

describe('signTransaction', () => {
  it('shoud exist', () => {
    const transactionModule = transactionModuleWithStubbedApiCalls()
    expect(transactionModule.signTransaction).to.be.a('function')
  })

  it('should sign transaction', () => {
    const xprv = 'xprv9s21ZrQH143K4UVYCa2N59SDjavhZSqV2vjQYUJzV5tq4rpJNo2BjKvin1vcwFzfENabiU5eiPiXVKCsBxjNSZyQBjT36EEN4spgL1uvrTs'
    const wrongXprv = 'xprv9s21ZrQH143K42jAsj3CsRB16Eh9MeN8SfKuiY23Aa33f2LEcVbDzBTn5QjtT83mr4wJ5LxHTMoU2DcqGVQwxrvorJJnDUL5YgQG7x2yP5c'
    const txHex = '0100000001145bb243544451ead3b8694a9597dc5e93583c0172ca16a2f2c74c8fd698be1100000000b5004830450221009f71f64142b1381e0ccdf2b868310b1b62bb57b3de4aca0554c03c881927be0a0220236412b2c299a1fd34d1a5b1b134b5fe5f3b479bb0fb29221447adb68effb48f014c6952210317b3b652ead4367b83303c377e4b2000b707f43694a17122bd65484f9f9e76ad2102251b99fde4b9d855d6afd1782c769988f9c39fa748a90b5e8b126fb208d834302103f16c3c588e2c29d8987842823e6cf326178e60650ebc613c3fab28afc16ffc4a53aeffffffff030065cd1d000000001976a914ff1cb7a5b23491534c66e7638f56d852ad47542288ac802b530b0000000017a91480cff499983050ec4268d749a1f898bec53e9fc28740548900000000001976a914ff1cb7a5b23491534c66e7638f56d852ad47542288ac00000000'
    const unspents: UTXO[] = [
      {
        txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
        n: 0,
        path: createPath(2, 0, 0),
        amount: new BigNumber('7')
      }
    ]

    const transactionModule = transactionModuleWithStubbedApiCalls()

    const result = transactionModule.signTransaction(xprv, txHex, unspents)
    expect(result.txHex).to.not.eq(txHex)

    expect(() => {
      transactionModule.signTransaction(wrongXprv, txHex, unspents)
    }).to.throw('Key pair cannot sign for this input')

    expect(() => {
      transactionModule.signTransaction(xprv, result.txHex, unspents)
    }).to.throw('Signature already exists')
  })
})

describe('sendCoins and signTransaction', () => {
  it('should send coins to testnet and signTransaction', async () => {
    // @ts-ignore
    config.networkFactory = (c : Currency) => SUPPORTED_NETWORKS[c].testnet
    stubCreateAddress(testnetChangeAddress)

    // generates keyPairs and address
    const userKeyPair = keyModule.deriveKeyPair(keyModule.generateNewKeyPair(), ROOT_DERIVATION_PATH)
    const backupKeyPair = keyModule.deriveKeyPair(keyModule.generateNewKeyPair(), ROOT_DERIVATION_PATH)
    const serverKeyPair = keyModule.deriveKeyPair(keyModule.generateNewKeyPair(), ROOT_DERIVATION_PATH)

    const { address } = addressModule.generateNewMultisigAddress([
      userKeyPair.pubKey,
      backupKeyPair.pubKey,
      serverKeyPair.pubKey
    ], '2/1/0')

    const inputValue = new BigNumber('7')
    const unspents = [
      {
        address,
        txHash: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
        n: 0,
        path: createPath(2, 0, 1),
        amount: inputValue
      }
    ];
    stubUnspents({
      change: 1.9,
      serviceFee: {
        amount: 0.09,
        address: testnetServiceAddress
      },
      outputs: unspents
    })
    stubGetWallet(userKeyPair, backupKeyPair, serverKeyPair)
    const sendTxMock = stubSendTx()

    const transactionModule = transactionModuleWithStubbedApiCalls()

    await transactionModule.send(
      '1234',
      '13',
      [{
        address: testnetDestinationAddress,
        amount: new BigNumber('5')
      }, {
        address,
        amount: new BigNumber('1.99990000')
      }

      ],
      userKeyPair.prvKey!,
    )

    const [, , transactionHex] = sendTxMock.mock.calls[0]

    const { txHex, txHash } = transactionModule.signTransaction(serverKeyPair.prvKey!, transactionHex, unspents);
    expect(txHash).to.not.eq('')
    expect(txHex).to.not.eq('')
  })
})

