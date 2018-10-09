import { expect } from 'chai'
import ethUtil from 'ethereumjs-util'
import { base58ToHDNode } from '../bitcoin'

import * as transaction from '../transaction-eth'
import * as backendApi from '../zlevator'
import { createETHOperationHash, createTokenOperationHash } from '../ethereum'

// process.env.ZLEVATOR_URL = 'http://localhost:9400/api/v1.0'
process.env.ZLEVATOR_URL = 'backurl/api/v1'

// @ts-ignore
backendApi.getNextNonce = jest.fn(() => {
  return Promise.resolve({
    contractNonce: 213
  })
})

// @ts-ignore
backendApi.sendETH = jest.fn(() => {
  return Promise.resolve({ tx: '123' })
})

// @ts-ignore
backendApi.sendTokens = jest.fn(() => {
  return Promise.resolve({ tx: '311' })
})

const prvKey = '2E63835168223C0D81C152B86C6AE6FFE8EDC63327691953251DCFC6895C96DA'
const signerAddress = ethUtil.privateToAddress(new Buffer(prvKey, 'hex')).toString('hex')

const a = new Buffer('2E63835168223C0D81C152B86C6AE6FFE8EDC63327691953251DCFC6895C96DA', 'hex')

describe('send ETH', () => {
  it('should exist', () => {
    expect(transaction.sendETH).to.be.a('function')
  })

  it('should send eth transaction', async () => {
    const address = '0xa378869a5009b131Ef9c0b300f4049F7bB7091e6'
    const amount = 1000000000
    const data = ''

    await transaction.sendETH(prvKey, address, amount, data)

    // @ts-ignore
    const [, value, expireTime, contractNonce, , signature] = backendApi.sendETH.mock.calls[0]

    const operationHash = createETHOperationHash(address, parseInt(value, 10), data, expireTime, contractNonce)

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

describe('send Tokens', () => {
  it('should exist', () => {
    expect(transaction.sendTokens).to.be.a('function')
  })

  it('should send tokens transaction', async () => {
    const address = '0xa378869a5009b131Ef9c0b300f4049F7bB7091e6'
    const tokenAddress = '0x208556478db204a13ff96b3ae2e808c70eabab7e'
    const amount = 200

    await transaction.sendTokens(prvKey, address, tokenAddress, amount)

    // @ts-ignore
    const [, value, expireTime, contractNonce, signature] = backendApi.sendTokens.mock.calls[0]

    const operationHash = createTokenOperationHash(address, parseInt(value, 10), tokenAddress, expireTime, contractNonce)

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
