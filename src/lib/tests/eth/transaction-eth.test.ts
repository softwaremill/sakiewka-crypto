import { expect } from 'chai'
import ethUtil from 'ethereumjs-util'

import transactionFactory from '../../eth/eth-transaction'
import * as backendApi from '../../eth/zlevator'
import ethereumFactory from '../../eth/ethereum'

import { v4 as uuid } from 'uuid'
import { fail } from 'assert'

// process.env.ZLEVATOR_URL = 'http://localhost:9400/api/v1.0'
process.env.ZLEVATOR_URL = 'backurl/api/v1'

// @ts-ignore
backendApi.getNextNonce = jest.fn(() => {
  return Promise.resolve({
    contractNonce: 213,
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
const transaction = transactionFactory('mainnet')
const ethereum = ethereumFactory('mainnet')
const prvKey =
  '2E63835168223C0D81C152B86C6AE6FFE8EDC63327691953251DCFC6895C96DA'
const signerAddress = ethUtil
  .privateToAddress(new Buffer(prvKey, 'hex'))
  .toString('hex')

describe('send ETH', () => {
  it('should exist', () => {
    expect(transaction.sendETH).to.be.a('function')
  })

  it('should send eth transaction', async () => {
    const address = '0xa378869a5009b131Ef9c0b300f4049F7bB7091e6'
    const amount = '1000000000'
    const data = ''

    await transaction.sendETH(prvKey, address, amount, data, uuid())

    // @ts-ignore
    const [
      ,
      value,
      expireBlock,
      contractNonce,
      ,
      signature,
    ] = backendApi.sendETH.mock.calls[0]

    const operationHash = ethereum.createETHOperationHash(
      address,
      value,
      data,
      expireBlock,
      contractNonce,
    )

    const sigParams = ethUtil.fromRpcSig(signature)
    const pub = ethUtil.ecrecover(
      new Buffer(ethUtil.stripHexPrefix(operationHash), 'hex'),
      sigParams.v,
      sigParams.r,
      sigParams.s,
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

    await transaction.sendTokens(prvKey, address, tokenAddress, '200', uuid())

    // @ts-ignore
    const [
      ,
      value,
      expireBlock,
      contractNonce,
      signature,
    ] = backendApi.sendTokens.mock.calls[0]

    const operationHash = ethereum.createTokenOperationHash(
      address,
      value,
      tokenAddress,
      expireBlock,
      contractNonce,
    )

    const sigParams = ethUtil.fromRpcSig(signature)
    const pub = ethUtil.ecrecover(
      new Buffer(ethUtil.stripHexPrefix(operationHash), 'hex'),
      sigParams.v,
      sigParams.r,
      sigParams.s,
    )
    const recoveredAddressBuff = ethUtil.pubToAddress(pub)
    const recoveredAddress = ethUtil.bufferToHex(recoveredAddressBuff)

    expect(ethUtil.stripHexPrefix(recoveredAddress)).to.eq(signerAddress)
  })
})

describe('sign generic message', () => {
  it('should sign generic transaction', async () => {
    const txType = 'MY_TX'
    const address = '0xa378869a5009b131Ef9c0b300f4049F7bB7091e6'

    const operationHash = ethereum.createGenericOperationHash(
      ['string', 'address'],
      [txType, address],
    )

    const signature = ethereum.createSignature(operationHash, prvKey)

    const sigParams = ethUtil.fromRpcSig(signature)
    const pub = ethUtil.ecrecover(
      new Buffer(ethUtil.stripHexPrefix(operationHash), 'hex'),
      sigParams.v,
      sigParams.r,
      sigParams.s,
    )
    const recoveredAddressBuff = ethUtil.pubToAddress(pub)
    const recoveredAddress = ethUtil.bufferToHex(recoveredAddressBuff)

    expect(ethUtil.stripHexPrefix(recoveredAddress)).to.eq(signerAddress)
  })
})

describe('sign Tokens', () => {
  it('should exist', () => {
    expect(transaction.signTokenTransaction).to.be.a('function')
  })

  it('should sign tokens transaction', async () => {
    const address = '0xa378869a5009b131Ef9c0b300f4049F7bB7091e6'
    const tokenAddress = '0x208556478db204a13ff96b3ae2e808c70eabab7e'

    const response = await transaction.signTokenTransaction(
      address,
      '200',
      tokenAddress,
      123,
      5556,
      prvKey,
    )

    expect(response.signature).to.be.eq(
      '0xf6c58e9c7a715b9a86f91582dc6926df52539bdd9943c82a2f34bd4a1801ac4519e85bf1350b8afff849a193b1517544792fbc4f5916cab7563669d918b3758e1b',
    )
  })

  it('should not accept value with trailing zeros passed as a string', async () => {
    const address = '0xa378869a5009b131Ef9c0b300f4049F7bB7091e6'
    const tokenAddress = '0x208556478db204a13ff96b3ae2e808c70eabab7e'

    try {
      await transaction.signTokenTransaction(
        address,
        '2000.00',
        tokenAddress,
        123,
        5556,
        prvKey,
      )
      fail('Error was not thrown')
    } catch (err) {
      expect(err.message).to.eq('Value was not an integer!')
    }
  })
})

describe('sign eth transaction', () => {
  it('should exist', () => {
    expect(transaction.signETHTransaction).to.be.a('function')
  })

  it('should sign tokens transaction', async () => {
    const address = '0xa378869a5009b131Ef9c0b300f4049F7bB7091e6'

    const response = await transaction.signETHTransaction(
      address,
      '200',
      '0x1',
      123,
      5556,
      prvKey,
    )

    expect(response.signature).to.be.eq(
      '0xf189aa0ff881a8f27c00ab8a9ee355b4e137e5941b3a0645bd35de94cb39ed6935ebc557fa14fc681d24b4651678ac4fac83d6c94ca7e2d4cce141baadbadad21c',
    )
  })

  it('should not accept value with trailing zeros passed as a string', async () => {
    const address = '0xa378869a5009b131Ef9c0b300f4049F7bB7091e6'

    try {
      await transaction.signETHTransaction(
        address,
        '200.00',
        '0x1',
        123,
        5556,
        prvKey,
      )
      fail('Error was not thrown')
    } catch (err) {
      expect(err.message).to.eq('Value was not an integer!')
    }
  })
})
