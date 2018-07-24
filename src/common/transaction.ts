import bitcoinjsLib from 'bitcoinjs-lib'

import { SendCoinsParams, UTXO } from '../types/domain'
import { getWalletUnspents, getWallet, sendTransaction, getNewChangeAddress } from './backend-api'

export const calculateChange = (unspents: UTXO[], transactionAmount: number) => {
  const unspentsSum = unspents.reduce(
    (acc: number, uns: UTXO) => {
      return acc + uns.amount
    },
    0
  )

  return unspentsSum - transactionAmount
}

export const sendCoins = async (params: SendCoinsParams) => {
  const unspents = await getWalletUnspents(params.userToken, params.walletId, 10000)
  const wallet = await getWallet(params.userToken, params.walletId)
  const signingKey = bitcoinjsLib.HDNode.fromBase58(params.xprv).keyPair
  const pubKeys = wallet.pubKeys.map((key: string) => (
    bitcoinjsLib.HDNode.fromBase58(key).getPublicKeyBuffer())
  )
  const txb = new bitcoinjsLib.TransactionBuilder
  const changeAmount = calculateChange(unspents, params.amount)
  const changeAddres = await getNewChangeAddress(params.userToken, params.walletId)

  const redeemScript = bitcoinjsLib.script.multisig.output.encode(2, pubKeys)

  unspents.forEach((uns: UTXO) => {
    txb.addInput(uns.txId, uns.index)
  })

  txb.addOutput(bitcoinjsLib.address.toOutputScript(params.destinationAddress), params.amount)
  txb.addOutput(bitcoinjsLib.address.toOutputScript(changeAddres), changeAmount)

  unspents.forEach((uns: UTXO, idx: number) => {
    txb.sign(idx, signingKey, redeemScript)
  })

  // TODO: derives proper xpriv based on unspent chainPath
  // TODO: derives 3 pubkeys based on unsepnt chainPath and creates redeemScript from them
  // TODO: calculate and subtract fee
  // TODO: send transaction
  // TODO: add support for multiple destination addresses

  // TODO: retrieve userXprv from backend

  const transactionHex = txb.build().toHex()
  const status = await sendTransaction(params.userToken, transactionHex)

  return {
    transactionHex,
    status
  }
}
