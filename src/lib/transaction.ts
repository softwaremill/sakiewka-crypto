import { SendCoinsParams, UTXO, Recipent } from '../types/domain'
import { getWalletUnspents, getWallet, sendTransaction, createNewAddress } from './backend-api'
import { getRecommendedFee } from './utils/fees'
import { BITCOIN_NETWORK } from './constants'
import {
  createMultisigRedeemScript,
  initializeTxBuilder,
  addressToOutputScript
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
  params: SendCoinsParams, networkName: string = BITCOIN_NETWORK
): Promise<any> => {
  const unspents = await getWalletUnspents(params.userToken, params.walletId, 10000)
  const wallet = await getWallet(params.userToken, params.walletId)
  const txb = initializeTxBuilder(networkName)

  const recommendedFee = await getRecommendedFee()
  const fee = calculateFee(recommendedFee, unspents.length, params.recipents.length + 1)

  const outputsAmount = sumOutputAmounts(params.recipents)

  const changeAmount = calculateChange(unspents, outputsAmount + fee)
  const changeAddres = await createNewAddress(params.userToken, params.walletId)

  unspents.forEach((uns: UTXO) => {
    txb.addInput(uns.txId, uns.index)
  })

  params.recipents.forEach((out: Recipent) => {
    txb.addOutput(addressToOutputScript(out.address, networkName), out.amount)
  })

  txb.addOutput(addressToOutputScript(changeAddres, networkName), changeAmount)

  unspents.forEach((uns: UTXO, idx: number) => {
    const signingKey = deriveKey(params.xprv, uns.path, networkName).keyPair

    const derivedPubKeys = wallet.pubKeys.map((key: string) => deriveKey(key, uns.path, networkName).neutered().toBase58())
    const redeemScript = createMultisigRedeemScript(derivedPubKeys)

    txb.sign(idx, signingKey, redeemScript)
  })

  // TODO: amount when collecting unspent should be increased by fee
  // TODO: check if change amount is not to small to create output

  // TODO: retrieve userXprv from backend

  const transactionHex = txb.build().toHex()
  const status = await sendTransaction(params.userToken, transactionHex)

  return {
    transactionHex,
    status
  }
}
