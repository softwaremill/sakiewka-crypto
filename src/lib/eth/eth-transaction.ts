import {
  getNextNonce,
  sendETH as sendETHApi,
  sendTokens as sendTokensApi,
} from './zlevator'
import { Signature } from '../../types/domain'
import { hourFromNow } from '../utils/helpers'
import ethereumFactory from './ethereum'

export default (btcNetwork: string) => {

  const ethereum = ethereumFactory(btcNetwork)

  const sendETH = async (
    prvKey: string, toAddress: string, value: string, data: string, withdrawalId: string,
  ) => {
    const { contractNonce, currentBlock } = await getNextNonce()
    const expireBlock = hourFromNow(currentBlock)
    const signature = signETHTransaction(toAddress, value, data, expireBlock, parseInt(contractNonce, 10), prvKey)

    return await sendETHApi(toAddress, value, expireBlock, contractNonce, data, signature.signature, withdrawalId)
  }

  const sendTokens = async (
    prvKey: string, toAddress: string, contractAddress: string, value: string, withdrawalId: string,
  ) => {
    const { contractNonce, currentBlock } = await getNextNonce()
    const expireBlock = hourFromNow(currentBlock)
    const signature = signTokenTransaction(toAddress, value, contractAddress, expireBlock, parseInt(contractNonce, 10), prvKey)

    return await sendTokensApi(toAddress, value, expireBlock, contractNonce, signature.signature, contractAddress, withdrawalId)
  }

  const signTokenTransaction = (
    toAddress: string, value: string, contractAddress: string, expiryDate: number,
    contractNonce: number, ethPrvKey: string,
  ): Signature => {
    const operationHash = ethereum.createTokenOperationHash(toAddress, value, contractAddress, expiryDate, contractNonce)

    return {
      operationHash,
      contractNonce,
      signature: ethereum.createSignature(operationHash, ethPrvKey),
    }
  }

  const signETHTransaction = (
    toAddress: string, value: string, data: string, expiryDate: number,
    contractNonce: number, ethPrvKey: string,
  ): Signature => {
    const operationHash = ethereum.createETHOperationHash(toAddress, value, data, expiryDate, contractNonce)

    return {
      operationHash,
      contractNonce,
      signature: ethereum.createSignature(operationHash, ethPrvKey),
    }
  }

  return {
    sendETH,
    sendTokens,
    signTokenTransaction,
    signETHTransaction,
  }
}
