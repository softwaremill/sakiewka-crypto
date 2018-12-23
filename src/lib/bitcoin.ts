import bitcoinjsLib, {
  Transaction,
  HDNode,
  Network,
  ECPair,
  TransactionBuilder,
  Out,
  In
} from 'bitcoinjs-lib'
import bip69 from 'bip69'
import { network } from './config'
import { UTXO, Recipent, Path, TxOut } from '../types/domain'
import { BigNumber } from "bignumber.js";

const base58ToKeyBuffer = (key: string): Buffer => {
  return bitcoinjsLib.HDNode.fromBase58(key, network).getPublicKeyBuffer()
}

export const createMultisigRedeemScript = (
  base58Keys: string[]
): Buffer => {
  const keyBuffers = base58Keys.sort().map((key: string) => base58ToKeyBuffer(key))
  return bitcoinjsLib.script.multisig.output.encode(2, keyBuffers)
}

export const multisigRedeemScriptToScriptPubKey = (
  redeemScript: Buffer
): Buffer => {
  return bitcoinjsLib.script.scriptHash.output.encode(
    bitcoinjsLib.crypto.hash160(redeemScript)
  )
}

export const redeemScriptToAddress = (
  redeemScript: Buffer
): string => {
  const scriptPubKey = multisigRedeemScriptToScriptPubKey(redeemScript)
  return bitcoinjsLib.address.fromOutputScript(scriptPubKey, network)
}

export const outputScriptToAddress = (
  outputScript: Buffer
): string => {
  return bitcoinjsLib.address.fromOutputScript(outputScript, network)
}

export const base58ToECPair = (
  base58Key: string
): ECPair => {
  return bitcoinjsLib.HDNode.fromBase58(base58Key, network).keyPair
}

export const base58ToHDNode = (
  base58Key: string
): HDNode => {
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
  return bitcoinjsLib.HDNode.fromSeedBuffer(seedBuffer, network)
}

export const txFromHex = (transactionHex: string): Transaction => {
  return bitcoinjsLib.Transaction.fromHex(transactionHex)
}

export const initializeTxBuilder = (): TransactionBuilder => {
  return new bitcoinjsLib.TransactionBuilder(network)
}

export const txBuilderFromTx = (
  tx: Transaction
): TransactionBuilder => {
  return bitcoinjsLib.TransactionBuilder.fromTransaction(tx, network)
}

export const addressToOutputScript = (
  address: string
): Buffer => {
  return bitcoinjsLib.address.toOutputScript(address, network)
}

export const decodeTxOutput = (output: Out): Recipent => ({
  amount: new BigNumber(output.value),
  address: outputScriptToAddress(output.script)
})

export const decodeTxInput = (input: In): UTXO => ({
  txHash: (input.hash.reverse() as Buffer).toString('hex'),
  n: input.index
})

export const sortUnspents = (inputs: UTXO[]): UTXO[] => {
  return bip69.sortInputs(inputs.map(utxoToBtcJS))
    .map(btcjsToUtxo)
}

export const recipentToTxOut = (recipent: Recipent) : TxOut => {
  return {
    script: addressToOutputScript(recipent.address),
    value : recipent.amount
  }
}

export const sortTxOuts = (outputs: TxOut[]) :TxOut[] => {
  return bip69.sortOutputs(outputs.map(tx => ({script:tx.script,value:tx.value.toNumber()})))
}

const btcjsToUtxo = (input: UTXO_btcjs): UTXO => {
  return {
    txHash: input.txId,
    n: input.vout,
    amount: input.amount,
    path: input.path
  }
}

const utxoToBtcJS = (input: UTXO): UTXO_btcjs => {
  return {
    txId: input.txHash,
    vout: input.n,
    amount: input.amount,
    path: input.path
  }
}

interface UTXO_btcjs {
  txId: string,
  vout: number,
  amount?: BigNumber,
  path?: Path
}