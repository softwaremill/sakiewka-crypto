import ethAbi from 'ethereumjs-abi'
import ethUtil from 'ethereumjs-util'

import { base58ToHDNode } from './bitcoin'

export const createETHOperationHash = (
  address: string, value: number, data: string, expireTime: number, contractNonce: number
) => {
  return ethUtil.bufferToHex(
    ethAbi.soliditySHA3(
      ['string', 'address', 'uint', 'string', 'uint', 'uint'],
      [
        'ETHER',
        new ethUtil.BN(address, 16),
        value,
        data,
        expireTime,
        contractNonce
      ]
    )
  )
}

export const createTokenOperationHash = (
  address: string, value: number, contractAddress: string, expireTime: number, contractNonce: number
) => {
  return ethUtil.bufferToHex(
    ethAbi.soliditySHA3(
      ['string', 'address', 'uint', 'address', 'uint', 'uint'],
      [
        'ERC20',
        new ethUtil.BN(address, 16),
        value,
        new ethUtil.BN(contractAddress, 16),
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
