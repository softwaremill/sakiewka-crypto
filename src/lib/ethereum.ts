import ethAbi from 'ethereumjs-abi'
import ethUtil from 'ethereumjs-util'

import bitcoin from './bitcoin'
import { Currency } from "../types/domain";
const { base58ToHDNode } = bitcoin(Currency.BTC)

const OnlyDigits = /^[1-9]+\d*$/

export const createETHOperationHash = (
  address: string, value: string, data: string, expireBlock: number, contractNonce: number
) => {
  if (!OnlyDigits.test(value)) {
    throw new Error("Value was not an integer!")
  }
  return ethUtil.bufferToHex(
    ethAbi.soliditySHA3(
      ['string', 'address', 'uint', 'string', 'uint', 'uint'],
      [
        'ETHER',
        new ethUtil.BN(address, 16),
        value,
        data,
        expireBlock,
        contractNonce
      ]
    )
  )
}

export const createTokenOperationHash = (
  address: string, value: string, contractAddress: string, expireBlock: number, contractNonce: number
) => {
  if (!OnlyDigits.test(value)) {
    throw new Error("Value was not an integer!")
  }
  return ethUtil.bufferToHex(
    ethAbi.soliditySHA3(
      ['string', 'address', 'uint', 'address', 'uint', 'uint'],
      [
        'ERC20',
        new ethUtil.BN(address, 16),
        value,
        new ethUtil.BN(contractAddress, 16),
        expireBlock,
        contractNonce
      ]
    )
  )
}

export const createGenericOperationHash = (
  types: string[], values: any[]
) => {
  return ethUtil.bufferToHex(
    ethAbi.soliditySHA3(
      types,
      values.map((elem: any, index: number) => {
        if (types[index] === 'address') {
          return new ethUtil.BN(elem.toString(), 16)
        } else return elem
      })
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
