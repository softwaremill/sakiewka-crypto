import { ethGetTransactionParams, ethSendTransaction } from './backend-api'
import {
  createETHOperationHash,
  createTokenOperationHash,
  createSignature,
  xprvToEthPrivateKey
} from './ethereum'

export const sendETH = async (
  userToken: string, toAddress: string, amount: number, data: string
) => {
  const xprv = process.env.ETH_PRV_KEY

  const { contractNonce } = await ethGetTransactionParams(userToken)

  const ethPrvKey = xprvToEthPrivateKey(xprv)

  const operationHash = createETHOperationHash(toAddress, amount, data, hourFromNow(), contractNonce)
  const signature = createSignature(operationHash, ethPrvKey)

  await ethSendTransaction(userToken, signature, operationHash)
}

export const sendToken = async (
  userToken: string, toAddress: string, contractAddress: string, amount: number
) => {
  const xprv = process.env.ETH_PRV_KEY

  const { contractNonce } = await ethGetTransactionParams(userToken)

  const ethPrvKey = xprvToEthPrivateKey(xprv)

  const operationHash = createTokenOperationHash(toAddress, amount, contractAddress, hourFromNow(), contractNonce)
  const signature = createSignature(operationHash, ethPrvKey)

  await ethSendTransaction(userToken, signature, operationHash)
}

const hourFromNow = () => (new Date().getTime() + (1000 * 60 * 60));