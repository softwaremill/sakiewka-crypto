import {
  getNextNonce,
  sendETH as sendETHApi,
  sendTokens as sendTokensApi
} from './zlevator'
import { Signature } from '../types/domain'
import { hourFromNow } from './utils/helpers'
import {
  createETHOperationHash,
  createTokenOperationHash,
  createSignature
} from './ethereum'

export const sendETH = async (
  prvKey: string, toAddress: string, value: number, data: string
) => {
  const { contractNonce, currentBlock } = await getNextNonce()
  const expireBlock = hourFromNow(currentBlock)
  const signature = signETHTransaction(toAddress, value, data, expireBlock, parseInt(contractNonce, 10), prvKey)

  return await sendETHApi(toAddress, value, expireBlock, contractNonce, data, signature.signature)
}

export const sendTokens = async (
  prvKey: string, toAddress: string, contractAddress: string, value: number
) => {
  const { contractNonce, currentBlock } = await getNextNonce()
  const expireBlock = hourFromNow(currentBlock)
  const signature = signTokenTransaction(toAddress, value, contractAddress, expireBlock, parseInt(contractNonce, 10), prvKey)

  return await sendTokensApi(toAddress, value, expireBlock, contractNonce, signature.signature, contractAddress)
}

export const signTokenTransaction = (
  toAddress: string, value: number, contractAddress: string, expiryDate: number,
  contractNonce: number, ethPrvKey: string
): Signature => {
  const operationHash = createTokenOperationHash(toAddress, value, contractAddress, expiryDate, contractNonce)

  return {
    operationHash,
    contractNonce,
    signature: createSignature(operationHash, ethPrvKey)
  }
}

export const signETHTransaction = (
  toAddress: string, value: number, data: string, expiryDate: number,
  contractNonce: number, ethPrvKey: string
): Signature => {
  const operationHash = createETHOperationHash(toAddress, value, data, expiryDate, contractNonce)

  return {
    operationHash,
    contractNonce,
    signature: createSignature(operationHash, ethPrvKey)
  }
}
