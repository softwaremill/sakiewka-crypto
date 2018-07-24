import { expect } from 'chai'
import bitcoinjsLib from 'bitcoinjs-lib'

import * as transaction from '../transaction'
import * as backendApi from '../backend-api'
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
  it('should exist', () => {
    expect(transaction.sendCoins).to.be.a('function')
  })

  it('should send coins', async () => {
    // generates keypairs and address
    const userKeypair = generateNewKeypair()
    const backupKeypair = generateNewKeypair()
    const serverKeypair = generateNewKeypair()
    const anotherKeypair = generateNewKeypair()

    const { address, redeemScript, scriptPubKey } = generateNewMultisigAddress([
      userKeypair.getPublicKeyBuffer(),
      backupKeypair.getPublicKeyBuffer(),
      serverKeypair.getPublicKeyBuffer()
    ])

    // mocks getWalletUnspents
    backendApi.getWalletUnspents = jest.fn(() => {
      return Promise.resolve([
        {
          address,
          txId: '11be98d68f4cc7f2a216ca72013c58935edc97954a69b8d3ea51445443b25b14',
          index: 0,
          path: '0/0'
        }
      ])
    })

    // mocks getWallet
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
      destinationAddress: '1QFuiEchKQEB1KCcsVULmJMsUhNTDb2PfN',
      amount: 5,
      xprv: userKeypair.toBase58()
    })

    // recreates transaction builder
    const tx = bitcoinjsLib.Transaction.fromHex(transactionHex)
    const txb = bitcoinjsLib.TransactionBuilder.fromTransaction(tx, bitcoinjsLib.networks.bitcoin)

    // should be able to sign with other keys without errors
    txb.sign(0, serverKeypair.keyPair, redeemScript)
    txb.sign(0, backupKeypair.keyPair, redeemScript)

    // signing again or using wrong key should throw errors
    expect(() => {
      txb.sign(0, userKeypair.keyPair, redeemScript)
    }).to.throw('Signature already exists')

    expect(() => {
      txb.sign(0, anotherKeypair.keyPair, redeemScript)
    }).to.throw('Key pair cannot sign for this input')

    expect(status).to.be.true
  })
})
