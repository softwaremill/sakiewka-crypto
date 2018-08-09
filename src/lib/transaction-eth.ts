import { ethGetTransactionParams, ethSendTransaction } from './backend-api'
import {
  createOperationHash,
  createSignature,
  xprvToEthPrivateKey
} from './ethereum'

export const send = async (
  userToken: string, toAddress: string, amount: number
) => {
  const xprv = process.env.ETH_PRV_KEY

  const { contractNonce } = await ethGetTransactionParams(userToken)

  const ethPrvKey = xprvToEthPrivateKey(xprv)

  const operationHash = createOperationHash(toAddress, amount, 123, contractNonce)
  const signature = createSignature(operationHash, ethPrvKey)

  await ethSendTransaction(userToken, signature, operationHash)
}
