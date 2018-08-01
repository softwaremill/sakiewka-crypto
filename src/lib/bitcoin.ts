import bitcoinjsLib, { Transaction, HDNode } from 'bitcoinjs-lib'

import { BITCOIN_NETWORK } from './constants'

const getNetwork = (networkName: string = BITCOIN_NETWORK) => {
  return bitcoinjsLib.networks[networkName]
}

const base58ToKeyBuffer = (key: string, networkName: string = BITCOIN_NETWORK) => {
  const network = getNetwork(networkName)
  return bitcoinjsLib.HDNode.fromBase58(key, network).getPublicKeyBuffer()
}

export const createMultisigRedeemScript = (
  base58Keys: string[], networkName: string = BITCOIN_NETWORK
) => {
  const keyBuffers = base58Keys.map((key: string) => base58ToKeyBuffer(key, networkName))

  return bitcoinjsLib.script.multisig.output.encode(2, keyBuffers)
}

export const redeemScriptToAddress = (
  redeemScript: Buffer, networkName: string = BITCOIN_NETWORK
) => {
  const network = getNetwork(networkName)

  const scriptPubKey = bitcoinjsLib.script.scriptHash.output.encode(
    bitcoinjsLib.crypto.hash160(redeemScript)
  )

  return bitcoinjsLib.address.fromOutputScript(scriptPubKey, network)
}

export const base58ToECPair = (base58Key: string, networkName: string = BITCOIN_NETWORK) => {
  const network = getNetwork(networkName)
  return bitcoinjsLib.HDNode.fromBase58(base58Key, network).keyPair
}

export const base58ToHDNode = (base58Key: string, networkName: string = BITCOIN_NETWORK) => {
  const network = getNetwork(networkName)
  return bitcoinjsLib.HDNode.fromBase58(base58Key, network)
}

export const hdNodeToBase58Pub = (node: HDNode) => {
  return node.neutered().toBase58()
}

export const hdNodeToBase58Prv = (node: HDNode) => {
  return node.toBase58()
}

export const seedBufferToHDNode = (seedBuffer: Buffer, networkName: string = BITCOIN_NETWORK) => {
  const network = getNetwork(networkName)
  return bitcoinjsLib.HDNode.fromSeedBuffer(seedBuffer, network)
}

export const txFromHex = (transactionHex: string) => {
  return bitcoinjsLib.Transaction.fromHex(transactionHex)
}

export const initializeTxBuilder = (networkName: string = BITCOIN_NETWORK) => {
  const network = getNetwork(networkName)
  return new bitcoinjsLib.TransactionBuilder(network)
}

export const txBuilderFromTx = (tx: Transaction, networkName: string = BITCOIN_NETWORK) => {
  const network = getNetwork(networkName)
  return bitcoinjsLib.TransactionBuilder.fromTransaction(tx, network)
}

export const addressToOutputScript = (address: string, networkName: string = BITCOIN_NETWORK) => {
  const network = getNetwork(networkName)
  return bitcoinjsLib.address.toOutputScript(address, network)
}
