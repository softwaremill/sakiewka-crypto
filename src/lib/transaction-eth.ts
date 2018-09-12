import { ethGetTransactionParams, ethSendTransaction } from './backend-api'
import { Signature } from '../types/domain'
import { hourFromNow } from './utils/helpers'
import {
  createETHOperationHash,
  createTokenOperationHash,
  createSignature,
  xprvToEthPrivateKey
} from './ethereum'

export const sendETH = async (
  userToken: string, prvKey: string, toAddress: string, amount: number, data: string
) => {
  const { contractNonce } = await ethGetTransactionParams(userToken)
  const ethPrvKey = xprvToEthPrivateKey(prvKey)
  const signature = signETHTransaction(toAddress, amount, data, hourFromNow(), contractNonce, ethPrvKey)

  await ethSendTransaction(userToken, signature.signature, signature.operationHash)
}

export const sendToken = async (
  userToken: string, prvKey: string, toAddress: string, contractAddress: string, amount: number
) => {
  const { contractNonce } = await ethGetTransactionParams(userToken)
  const ethPrvKey = xprvToEthPrivateKey(prvKey)
  const signature = signTokenTransaction(toAddress, amount, contractAddress, hourFromNow(), contractNonce, ethPrvKey)

  await ethSendTransaction(userToken, signature.signature, signature.operationHash)
}

export const signTokenTransaction = (
  toAddress: string, amount: number, contractAddress: string, expiryDate: number,
  contractNonce: number, ethPrvKey: string
): Signature => {
  const operationHash = createTokenOperationHash(toAddress, amount, contractAddress, expiryDate, contractNonce)

  return {
    operationHash,
    contractNonce,
    signature: createSignature(operationHash, ethPrvKey)
  }
}

export const signETHTransaction = (
  toAddress: string, amount: number, data: string, expiryDate: number,
  contractNonce: number, ethPrvKey: string
): Signature => {
  const operationHash = createETHOperationHash(toAddress, amount, data, expiryDate, contractNonce)

  return {
    operationHash,
    contractNonce,
    signature: createSignature(operationHash, ethPrvKey)
  }
}
