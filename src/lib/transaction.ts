import { SendCoinsParams, UTXO, Recipent } from '../types/domain'
import { listUnspents, getWallet, sendTransaction, createNewAddress } from './backend-api'
import { getRecommendedFee } from './utils/fees'
import {
  createMultisigRedeemScript,
  initializeTxBuilder,
  addressToOutputScript,
  txFromHex,
  decodeTxOutput,
  decodeTxInput
} from './bitcoin'
import { deriveKey } from './key'

export const calculateChange = (unspents: UTXO[], transactionAmount: number): number => {
  const unspentsSum = unspents.reduce(
    (acc: number, uns: UTXO) => {
      return acc + uns.amount
    },
    0
  )

  return unspentsSum - transactionAmount
}

export const calculateFee = (
  satoshiPerByte: number, numOfInputs: number, numOfOutputs: number
): number => {
  return (numOfInputs * 180 + numOfOutputs * 34 + 10) * satoshiPerByte
}

export const sumOutputAmounts = (outputs: Recipent[]): number => {
  return outputs.reduce(
    (acc: number, out: Recipent) => {
      return acc + out.amount
    },
    0
  )
}

export const sendCoins = async (
  params: SendCoinsParams
): Promise<any> => {
  const unspentsResponse = await listUnspents(params.userToken, params.walletId, 10000)
  const unspents = unspentsResponse.data.unspents
  const wallet = await getWallet(params.userToken, params.walletId)
  const txb = initializeTxBuilder()

  const recommendedFee = await getRecommendedFee()
  const fee = calculateFee(recommendedFee, unspents.length, params.recipents.length + 1)

  const outputsAmount = sumOutputAmounts(params.recipents)

  const changeAmount = calculateChange(unspents, outputsAmount + fee)
  const changeAddres = await createNewAddress(params.userToken, params.walletId)

  unspents.forEach((uns: UTXO) => {
    txb.addInput(uns.txId, uns.index)
  })

  params.recipents.forEach((out: Recipent) => {
    txb.addOutput(addressToOutputScript(out.address), out.amount)
  })

  txb.addOutput(addressToOutputScript(changeAddres.address), changeAmount)

  unspents.forEach((uns: UTXO, idx: number) => {
    const signingKey = deriveKey(params.xprv, uns.path).keyPair

    // TODO: set proper order of signing keys. User key should be first
    const derivedPubKeys = wallet.pubKeys.map((key: string) => deriveKey(key, uns.path).neutered().toBase58())
    const redeemScript = createMultisigRedeemScript(derivedPubKeys)

    txb.sign(idx, signingKey, redeemScript)
  })

  const transactionHex = txb.build().toHex()
  const status = await sendTransaction(params.userToken, transactionHex)

  return {
    transactionHex,
    status
  }
}

export const decodeTransaction = (txHex: string) => {
  const tx = txFromHex(txHex)
  const outputs = tx.outs.map(decodeTxOutput)
  const inputs = tx.ins.map(decodeTxInput)

  return { outputs, inputs }
}
