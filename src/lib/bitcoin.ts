import bitcoinjsLib, {
  Transaction,
  HDNode,
  Network,
  ECPair,
  TransactionBuilder
} from 'bitcoinjs-lib'
import { network as networkName } from './config'

import { BITCOIN_NETWORK } from './constants'

const getNetwork = (networkName: string = BITCOIN_NETWORK): Network => {
  return bitcoinjsLib.networks[networkName]
}

const base58ToKeyBuffer = (key: string): Buffer => {
  const network = getNetwork(networkName)
  return bitcoinjsLib.HDNode.fromBase58(key, network).getPublicKeyBuffer()
}

export const createMultisigRedeemScript = (
  base58Keys: string[]
): Buffer => {
  const keyBuffers = base58Keys.map((key: string) => base58ToKeyBuffer(key))

  return bitcoinjsLib.script.multisig.output.encode(2, keyBuffers)
}

export const redeemScriptToAddress = (
  redeemScript: Buffer
): string => {
  const network = getNetwork(networkName)

  const scriptPubKey = bitcoinjsLib.script.scriptHash.output.encode(
    bitcoinjsLib.crypto.hash160(redeemScript)
  )

  return bitcoinjsLib.address.fromOutputScript(scriptPubKey, network)
}

export const base58ToECPair = (
  base58Key: string
): ECPair => {
  const network = getNetwork(networkName)
  return bitcoinjsLib.HDNode.fromBase58(base58Key, network).keyPair
}

export const base58ToHDNode = (
  base58Key: string
): HDNode => {
  const network = getNetwork(networkName)
  return bitcoinjsLib.HDNode.fromBase58(base58Key, network)
}

export const hdNodeToBase58Pub = (node: HDNode): string => {
  return node.neutered().toBase58()
}

export const hdNodeToBase58Prv = (node: HDNode): string => {
  return node.toBase58()
}

export const seedBufferToHDNode = (
  seedBuffer: Buffer
): HDNode => {
  const network = getNetwork(networkName)
  return bitcoinjsLib.HDNode.fromSeedBuffer(seedBuffer, network)
}

export const txFromHex = (transactionHex: string): Transaction => {
  return bitcoinjsLib.Transaction.fromHex(transactionHex)
}

export const initializeTxBuilder = (): TransactionBuilder => {
  const network = getNetwork(networkName)
  return new bitcoinjsLib.TransactionBuilder(network)
}

export const txBuilderFromTx = (
  tx: Transaction
): TransactionBuilder => {
  const network = getNetwork(networkName)
  return bitcoinjsLib.TransactionBuilder.fromTransaction(tx, network)
}

export const addressToOutputScript = (
  address: string
): Buffer => {
  const network = getNetwork(networkName)
  return bitcoinjsLib.address.toOutputScript(address, network)
}
