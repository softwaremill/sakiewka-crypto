import { UTXO, Recipent, DecodedTx } from '../types/domain'
import { listUnspents, getWallet, sendTransaction, createNewAddress } from './backend-api'
import { getRecommendedFee } from './utils/fees'
import {
  createMultisigRedeemScript,
  initializeTxBuilder,
  addressToOutputScript,
  txFromHex,
  decodeTxOutput,
  decodeTxInput,
  txBuilderFromTx
} from './bitcoin'
import { deriveKey } from './key'
import { decrypt } from './crypto'

export const calculateChange = (unspents: UTXO[], transactionAmount: number): number => {
  const unspentsSum = unspents.reduce(
    (acc: number, uns: UTXO) => {
      return acc + uns.value
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
      return acc + out.value
    },
    0
  )
}

export const sendCoins = async (
  userToken: string, xprv: string, walletId: string, recipents: Recipent[]
): Promise<any> => {
  const unspentsResponse = await listUnspents(userToken, walletId, 10000)
  const unspents = unspentsResponse.data.unspents
  const wallet = await getWallet(userToken, walletId)
  const txb = initializeTxBuilder()

  const recommendedFee = await getRecommendedFee()
  const fee = calculateFee(recommendedFee, unspents.length, recipents.length + 1)

  const outputsAmount = sumOutputAmounts(recipents)

  const changeAmount = calculateChange(unspents, outputsAmount + fee)
  const changeAddres = await createNewAddress(userToken, walletId)

  unspents.forEach((uns: UTXO) => {
    txb.addInput(uns.txHash, uns.index)
  })

  recipents.forEach((out: Recipent) => {
    txb.addOutput(addressToOutputScript(out.address), out.value)
  })

  txb.addOutput(addressToOutputScript(changeAddres.address), changeAmount)

  unspents.forEach((uns: UTXO, idx: number) => {
    const signingKey = deriveKey(xprv, uns.path).keyPair

    const derivedPubKeys = wallet.pubKeys.map((key: string) => deriveKey(key, uns.path).neutered().toBase58())
    const redeemScript = createMultisigRedeemScript(derivedPubKeys)

    txb.sign(idx, signingKey, redeemScript)
  })

  const transactionHex = txb.build().toHex()
  const status = await sendTransaction(userToken, transactionHex)

  return {
    transactionHex,
    status
  }
}

export const decodeTransaction = (txHex: string): DecodedTx => {
  const tx = txFromHex(txHex)
  const outputs = tx.outs.map(decodeTxOutput)

  const inputs = tx.ins.map(decodeTxInput)

  return { outputs, inputs }
}

export const signTransaction = (
  encryptedXprv: string, txHex: string, pubKeys: string[], unspents: UTXO[]
) => {
  const tx = txFromHex(txHex)
  const txb = txBuilderFromTx(tx)
  const xprv = decrypt(getServicePassphrase(), encryptedXprv)

  unspents.forEach((uns: UTXO, idx: number) => {
    const signingKey = deriveKey(xprv, uns.path).keyPair
    txb.sign(idx, signingKey)
  })

  const builtTx = txb.build()

  return {
    txHex: builtTx.toHex(),
    txHash: builtTx.getId()
  }
}

const getServicePassphrase = () => process.env.SERVICE_PASSPHRASE
