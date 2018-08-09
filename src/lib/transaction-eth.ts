import { ethGetTransactionParams, ethSendTransaction } from './backend-api'
import {
  createOperationHash,
  createSignature,
  xprvToEthPrivateKey
} from './ethereum'

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

  await ethSendTransaction(signature, operationHash)
}
