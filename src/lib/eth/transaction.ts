import ethAbi from 'ethereumjs-abi'
import ethUtil from 'ethereumjs-util'

import { ethGetTransactionParams, ethSendTransaction } from '../backend-api'
import { base58ToHDNode } from '../bitcoin'

export const createOperationHash = (
  address: string, amount: number, expireTime: number, contractNonce: number
) => {
  return ethUtil.bufferToHex(
    ethAbi.soliditySHA3(
      ['address', 'uint', 'string', 'uint', 'uint'],
      [
        new ethUtil.BN(address, 16),
        amount,
        '',
        expireTime,
        contractNonce
      ]
    )
  )
}

export const createSignature = (operationHash: string, prvKey: string) => {

  const signatureInParts = ethUtil.ecsign(
    new Buffer(ethUtil.stripHexPrefix(operationHash), 'hex'),
    new Buffer(prvKey, 'hex')
  )

  const r = ethUtil.setLengthLeft(signatureInParts.r, 32).toString('hex')
  const s = ethUtil.setLengthLeft(signatureInParts.s, 32).toString('hex')
  const v = ethUtil.stripHexPrefix(ethUtil.intToHex(signatureInParts.v, 32))

  return ethUtil.addHexPrefix(r.concat(s, v))
}

export const xprvToEthPrivateKey = (xprv: string) => {
  const hdNode = base58ToHDNode(xprv)
  const ethPrvKey = hdNode.keyPair.d.toBuffer()
  return ethUtil.setLengthLeft(ethPrvKey, 32).toString('hex')
}

export const send = async (
  passphrase: string, toAddress: string, amount: number
) => {
  const xprv = process.env.ETH_PRV_KEY

  const {
    gasLimit, gasPrice, nonce, contractNonce
  } = await ethGetTransactionParams(toAddress)

  const ethPrvKey = xprvToEthPrivateKey(xprv)

  const operationHash = createOperationHash(toAddress, amount, 123, contractNonce)
  const signature = createSignature(operationHash, ethPrvKey)

  const status = await ethSendTransaction(signature)

  return status
}
