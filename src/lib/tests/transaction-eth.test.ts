import { expect } from 'chai'
import ethUtil from 'ethereumjs-util'
import { base58ToECPair } from '../bitcoin'

import * as transaction from '../transaction-eth'
import * as backendApi from '../backend-api'

// @ts-ignore
backendApi.ethGetTransactionParams = jest.fn(() => {
  return Promise.resolve({
    gasLimit: '123',
    gasPrice: '123',
    nonce: 10,
    contractNonce: 213
  })
})

// @ts-ignore
backendApi.ethSendTransaction = jest.fn(() => {
  return Promise.resolve({ status: 'ok' })
})


describe('send ETH', () => {
  it('should exist', () => {
    expect(transaction.sendETH).to.be.a('function')
  })

  it('should send eth transaction', async () => {
    const address = '0xa378869a5009b131Ef9c0b300f4049F7bB7091e6'
    const userToken = '123'
    const amount = 1000000000
    const data = ''
    const prvKey = 'xprv9s21ZrQH143K27LPi9gM65jmXFuBfiY7S5HReQarD7dTX9svAXQmQYsqxVqMcbtRWxDwBkdRxSxhfPBX4Vt7Juc9CqY4i3AaPNwCeM1w1Ym'
    const hexPrvKey = base58ToECPair(prvKey).d.toHex()
    const signerAddress = ethUtil.privateToAddress(new Buffer(hexPrvKey, 'hex')).toString('hex')

    await transaction.sendETH(userToken, prvKey, address, amount, data)

    // @ts-ignore
    const [, signature, operationHash] = backendApi.ethSendTransaction.mock.calls[0]

    const sigParams = ethUtil.fromRpcSig(signature)
    const pub = ethUtil.ecrecover(
      new Buffer(ethUtil.stripHexPrefix(operationHash), 'hex'),
      sigParams.v, sigParams.r, sigParams.s
    )
    const recoveredAddressBuff = ethUtil.pubToAddress(pub)
    const recoveredAddress = ethUtil.bufferToHex(recoveredAddressBuff)

    expect(ethUtil.stripHexPrefix(recoveredAddress)).to.eq(signerAddress)
  })
})

describe('send Token', () => {
  it('should exist', () => {
    expect(transaction.sendToken).to.be.a('function')
  })

  it('should send eth transaction', async () => {
    const address = '0xa378869a5009b131Ef9c0b300f4049F7bB7091e6'
    const contractAddress = '0x627306090abab3a6e1400e9345bc60c78a8bef57'
    const userToken = '123'
    const amount = 1000000000
    const prvKey = 'xprv9s21ZrQH143K27LPi9gM65jmXFuBfiY7S5HReQarD7dTX9svAXQmQYsqxVqMcbtRWxDwBkdRxSxhfPBX4Vt7Juc9CqY4i3AaPNwCeM1w1Ym'
    const hexPrvKey = base58ToECPair(prvKey).d.toHex()
    const signerAddress = ethUtil.privateToAddress(new Buffer(hexPrvKey, 'hex')).toString('hex')

    await transaction.sendToken(userToken, prvKey, address, contractAddress, amount)

    // @ts-ignore
    const [, signature, operationHash] = backendApi.ethSendTransaction.mock.calls[0]

    const sigParams = ethUtil.fromRpcSig(signature)
    const pub = ethUtil.ecrecover(
      new Buffer(ethUtil.stripHexPrefix(operationHash), 'hex'),
      sigParams.v, sigParams.r, sigParams.s
    )
    const recoveredAddressBuff = ethUtil.pubToAddress(pub)
    const recoveredAddress = ethUtil.bufferToHex(recoveredAddressBuff)

    expect(ethUtil.stripHexPrefix(recoveredAddress)).to.eq(signerAddress)
  })
})
