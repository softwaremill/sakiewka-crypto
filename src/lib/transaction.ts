import bitcoinjsLib from 'bitcoinjs-lib'

import { SendCoinsParams, UTXO, Recipent } from '../types/domain'
import { getWalletUnspents, getWallet, sendTransaction, getNewChangeAddress } from './backend-api'
import { getRecommendedFee } from './utils/fees'
import { BITCOIN_NETWORK } from './constants'

export const calculateChange = (unspents: UTXO[], transactionAmount: number) => {
  const unspentsSum = unspents.reduce(
    (acc: number, uns: UTXO) => {
      return acc + uns.amount
    },
    0
  )

  return unspentsSum - transactionAmount
}

export const calculateFee = (satoshiPerByte: number, numOfInputs: number, numOfOutputs: number) => {
  return (numOfInputs * 180 + numOfOutputs * 34 + 10) * satoshiPerByte
}

export const sumOutputAmounts = (outputs: Recipent[]) => {
  return outputs.reduce(
    (acc: number, out: Recipent) => {
      return acc + out.amount
    },
    0
  )
}

export const sendCoins = async (params: SendCoinsParams, networkName: string = BITCOIN_NETWORK) => {
  const network = bitcoinjsLib.networks[networkName]

  const unspents = await getWalletUnspents(params.userToken, params.walletId, 10000)
  const wallet = await getWallet(params.userToken, params.walletId)
  const signingKey = bitcoinjsLib.HDNode.fromBase58(params.xprv, network).keyPair
  const pubKeys = wallet.pubKeys.map((key: string) => (
    bitcoinjsLib.HDNode.fromBase58(key, network).getPublicKeyBuffer())
  )
  const txb = new bitcoinjsLib.TransactionBuilder(network)

  const recommendedFee = await getRecommendedFee()
  const fee = calculateFee(recommendedFee, unspents.length, params.recipents.length + 1)

  const outputsAmount = sumOutputAmounts(params.recipents)

  const changeAmount = calculateChange(unspents, outputsAmount + fee)
  const changeAddres = await getNewChangeAddress(params.userToken, params.walletId)

  const redeemScript = bitcoinjsLib.script.multisig.output.encode(2, pubKeys)

  unspents.forEach((uns: UTXO) => {
    txb.addInput(uns.txId, uns.index)
  })

  params.recipents.forEach((out: Recipent) => {
    txb.addOutput(bitcoinjsLib.address.toOutputScript(out.address, network), out.amount)
  })

  txb.addOutput(bitcoinjsLib.address.toOutputScript(changeAddres, network), changeAmount)

  unspents.forEach((uns: UTXO, idx: number) => {
    txb.sign(idx, signingKey, redeemScript)
  })

  // TODO: amount when collecting unspent should be increased by fee
  // TODO: check if change amount is not to small to create output
  // TODO: derives proper xpriv based on unspent chainPath
  // TODO: derives 3 pubkeys based on unsepnt chainPath and creates redeemScript from them
  // TODO: calculate and subtract fee
  // TODO: send transaction

  // TODO: retrieve userXprv from backend

  const transactionHex = txb.build().toHex()
  const status = await sendTransaction(params.userToken, transactionHex)

  return {
    transactionHex,
    status
  }
}
