import { SendCoinsParams, UTXO, Recipent } from '../types/domain'
import { getWalletUnspents, getWallet, sendTransaction, getNewChangeAddress } from './backend-api'
import { getRecommendedFee } from './utils/fees'
import { BITCOIN_NETWORK } from './constants'
import {
  base58ToECPair,
  createMultisigRedeemScript,
  initializeTxBuilder,
  addressToOutputScript
} from './bitcoin'

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
  const unspents = await getWalletUnspents(params.userToken, params.walletId, 10000)
  const wallet = await getWallet(params.userToken, params.walletId)
  const signingKey = base58ToECPair(params.xprv, networkName)
  const txb = initializeTxBuilder(networkName)

  const recommendedFee = await getRecommendedFee()
  const fee = calculateFee(recommendedFee, unspents.length, params.recipents.length + 1)

  const outputsAmount = sumOutputAmounts(params.recipents)

  const changeAmount = calculateChange(unspents, outputsAmount + fee)
  const changeAddres = await getNewChangeAddress(params.userToken, params.walletId)

  const redeemScript = createMultisigRedeemScript(wallet.pubKeys)

  unspents.forEach((uns: UTXO) => {
    txb.addInput(uns.txId, uns.index)
  })

  params.recipents.forEach((out: Recipent) => {
    txb.addOutput(addressToOutputScript(out.address, networkName), out.amount)
  })

  txb.addOutput(addressToOutputScript(changeAddres, networkName), changeAmount)

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
