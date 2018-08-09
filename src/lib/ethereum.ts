import ethAbi from 'ethereumjs-abi'
import ethUtil from 'ethereumjs-util'

import { base58ToHDNode } from './bitcoin'

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
  const ethPrvKey = new Buffer(hdNode.keyPair.d.toHex(), 'hex')
  return ethUtil.setLengthLeft(ethPrvKey, 32).toString('hex')
}
