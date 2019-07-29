import {
  Transaction,
  HDNode,
  ECPair,
  TransactionBuilder,
  Out,
  In,
} from 'bitcoinjs-lib'
import bip69 from 'bip69'
import {
  UTXO,
  Receipient,
  Path,
  TxOut,
} from '../../types/domain/transaction'
import { BigNumber } from 'bignumber.js'

const btcjsToUtxo = (input: UTXObtcjs): UTXO => {
  return {
    txHash: input.txId,
    n: input.vout,
    amount: input.amount,
    path: input.path,
  }
}

const utxoToBtcJS = (input: UTXO): UTXObtcjs => {
  return {
    txId: input.txHash,
    vout: input.n,
    amount: input.amount,
    path: input.path,
  }
}

interface UTXObtcjs {
  txId: string
  vout: number
  amount?: BigNumber
  path?: Path
}

export class BitcoinOperations {
  protected bitcoinLib: any
  protected network: any

  constructor(network: any) {
    this.network = network
  }

  private base58ToKeyBuffer = (key: string): Buffer => {
    return this.bitcoinLib.HDNode.fromBase58(
      key,
      this.network,
    ).getPublicKeyBuffer()
  }

  createMultisigRedeemScript = (base58Keys: string[]): Buffer => {
    const keyBuffers = base58Keys
      .sort()
      .map((key: string) => this.base58ToKeyBuffer(key))
    return this.bitcoinLib.script.multisig.output.encode(2, keyBuffers)
  }

  multisigRedeemScriptToScriptPubKey = (redeemScript: Buffer): Buffer => {
    return this.bitcoinLib.script.scriptHash.output.encode(
      this.bitcoinLib.crypto.hash160(redeemScript),
    )
  }

  redeemScriptToAddress = (redeemScript: Buffer): string => {
    const scriptPubKey = this.multisigRedeemScriptToScriptPubKey(redeemScript)
    return this.bitcoinLib.address.fromOutputScript(scriptPubKey, this.network)
  }

  outputScriptToAddress = (outputScript: Buffer): string => {
    return this.bitcoinLib.address.fromOutputScript(outputScript, this.network)
  }

  base58ToECPair = (base58Key: string): ECPair => {
    return this.bitcoinLib.HDNode.fromBase58(base58Key, this.network).keyPair
  }

  base58ToHDNode = (base58Key: string): HDNode => {
    return this.bitcoinLib.HDNode.fromBase58(base58Key, this.network)
  }

  hdNodeToBase58Pub = (node: HDNode): string => {
    return node.neutered().toBase58()
  }

  hdNodeToBase58Prv = (node: HDNode): string => {
    return node.toBase58()
  }

  seedBufferToHDNode = (seedBuffer: Buffer): HDNode => {
    return this.bitcoinLib.HDNode.fromSeedBuffer(seedBuffer, this.network)
  }

  txFromHex = (transactionHex: string): Transaction => {
    return this.bitcoinLib.Transaction.fromHex(transactionHex)
  }

  addressToOutputScript = (address: string): Buffer => {
    return this.bitcoinLib.address.toOutputScript(address, this.network)
  }

  decodeTxOutput = (output: Out): Receipient => ({
    amount: new BigNumber(output.value),
    address: this.outputScriptToAddress(output.script),
  })

  decodeTxInput = (input: In): UTXO => ({
    txHash: (input.hash.reverse() as Buffer).toString('hex'),
    n: input.index,
  })

  sortUnspents = (inputs: UTXO[]): UTXO[] => {
    return bip69.sortInputs(inputs.map(utxoToBtcJS)).map(btcjsToUtxo)
  }

  recipientToTxOut = (recipient: Receipient): TxOut => {
    return {
      script: this.addressToOutputScript(recipient.address),
      value: recipient.amount,
    }
  }

  sortTxOuts = (outputs: TxOut[]): TxOut[] => {
    return bip69
      .sortOutputs(
        outputs.map((tx: TxOut) => ({ script: tx.script, value: tx.value.toNumber() })),
      )
      .map((tx: TxOut) => ({ script: tx.script, value: new BigNumber(tx.value) }))
  }

  initializeTxBuilder: () => TransactionBuilder

  txBuilderFromTx: (tx: Transaction) => TransactionBuilder

  sign: (
    txb: TransactionBuilder,
    idx: number,
    signingKey: ECPair,
    amount?: BigNumber,
    redeemScript?: Buffer,
  ) => void
}
