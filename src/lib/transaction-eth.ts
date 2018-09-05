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

  const signature = signETHTransaction(toAddress, amount, data, hourFromNow(), contractNonce, ethPrvKey)

  await ethSendTransaction(userToken, signature.signature, signature.operationHash)
}

export const sendToken = async (
  userToken: string, toAddress: string, contractAddress: string, amount: number
) => {
  const xprv = process.env.ETH_PRV_KEY

  const { contractNonce } = await ethGetTransactionParams(userToken)

  const ethPrvKey = xprvToEthPrivateKey(xprv)

  const signature = signTokenTransaction(toAddress, amount, contractAddress, hourFromNow(), contractNonce, ethPrvKey)

  await ethSendTransaction(userToken, signature.signature, signature.operationHash)
}

export const signTokenTransaction = (toAddress: string, amount: number, contractAddress: string, expiryDate: number, 
  contractNonce: number, ethPrvKey: string) => {
    const operationHash = createTokenOperationHash(toAddress, amount, contractAddress, expiryDate, contractNonce)
    return new Signature(operationHash, createSignature(operationHash, ethPrvKey), contractNonce)
  }

export const signETHTransaction = (toAddress: string, amount: number, data: string, expiryDate: number,
  contractNonce: number, ethPrvKey: string) => {
    const operationHash = createETHOperationHash(toAddress, amount, data, expiryDate, contractNonce)
    return new Signature(operationHash, createSignature(operationHash, ethPrvKey), contractNonce)
  }

const hourFromNow = () => (new Date().getTime() + (1000 * 60 * 60));

class Signature {
  operationHash: string;
  signature: string;
  contractNonce: number;

  constructor (operationHash: string, signature: string, contractNonce: number) {
    this.operationHash = operationHash;
    this.signature = signature;
    this.contractNonce = contractNonce;
  }
}