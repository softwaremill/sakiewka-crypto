import { expect } from 'chai'
import ethUtil from 'ethereumjs-util'
import { base58ToHDNode } from '../bitcoin'

import * as transaction from '../transaction-eth'
import * as backendApi from '../zlevator'
import { createETHOperationHash } from '../ethereum'

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

describe('send ETH', () => {
  it('should exist', () => {
    expect(transaction.sendETH).to.be.a('function')
  })

  it('should send eth transaction', async () => {
    const address = '0xa378869a5009b131Ef9c0b300f4049F7bB7091e6'
    const amount = 1000000000
    const data = ''
    const rootKey = 'xprv9s21ZrQH143K3ruqyf88aDddpJyL5b4kKopPN3ueB1T1ErSdDb5zpVYzqrDMET49gYivEoPatEgVdii6Jic5fLxycUEuuJeRTikkkmjovqa'
    const hdNode = base58ToHDNode(rootKey)
    const derivedKey = hdNode.derivePath('m/44\'/60\'/0\'/0/1')
    const derivedXprv = derivedKey.toBase58()
    const signerAddress = ethUtil.privateToAddress(new Buffer('2E63835168223C0D81C152B86C6AE6FFE8EDC63327691953251DCFC6895C96DA', 'hex')).toString('hex')

    await transaction.sendETH(derivedXprv, address, amount, data)

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

describe('send Token', () => {
  it('should exist', () => {
    expect(transaction.sendToken).to.be.a('function')
  })

  // it('should send eth transaction', async () => {
  //   const address = '0xa378869a5009b131Ef9c0b300f4049F7bB7091e6'
  //   const contractAddress = '0x627306090abab3a6e1400e9345bc60c78a8bef57'
  //   const userToken = '123'
  //   const amount = 1000000000
  //   const prvKey = 'xprv9s21ZrQH143K27LPi9gM65jmXFuBfiY7S5HReQarD7dTX9svAXQmQYsqxVqMcbtRWxDwBkdRxSxhfPBX4Vt7Juc9CqY4i3AaPNwCeM1w1Ym'
  //   const hexPrvKey = base58ToECPair(prvKey).d.toHex()
  //   const signerAddress = ethUtil.privateToAddress(new Buffer(hexPrvKey, 'hex')).toString('hex')

  //   await transaction.sendToken(userToken, prvKey, address, contractAddress, amount)

  //   // @ts-ignore
  //   const [, signature, operationHash] = backendApi.ethSendTransaction.mock.calls[0]

  //   const sigParams = ethUtil.fromRpcSig(signature)
  //   const pub = ethUtil.ecrecover(
  //     new Buffer(ethUtil.stripHexPrefix(operationHash), 'hex'),
  //     sigParams.v, sigParams.r, sigParams.s
  //   )
  //   const recoveredAddressBuff = ethUtil.pubToAddress(pub)
  //   const recoveredAddress = ethUtil.bufferToHex(recoveredAddressBuff)

  //   expect(ethUtil.stripHexPrefix(recoveredAddress)).to.eq(signerAddress)
  // })
})
