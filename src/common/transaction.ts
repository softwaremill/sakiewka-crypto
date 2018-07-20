import bitcoinjsLib from 'bitcoinjs-lib'

import { SendCoinsParams, UTXO } from './domain'
import { getWalletDetailed } from './backend-api'
import { getUserXprv } from './wallet'

export const sendTransaction = () => {}

export const createTransaction = (amount: number, recipent: string, unspents: object[]) => {
}
export const signTransaction = () => {}

export const sendCoins = async (params: SendCoinsParams) => {
  const wallet = await getWalletDetailed(params.walletId)
  const xprv = params.xprv || getUserXprv(wallet, params.walletPassphrase)
  const keyPair = bitcoinjsLib.HDNode.fromBase58(xprv).keyPair
  const txb = new bitcoinjsLib.TransactionBuilder

  // TODO: use only necessary amount of unspents
  const unspents = wallet.unspents

  // TODO: add support for multiple destination addresses
  txb.addOutput(bitcoinjsLib.address.toOutputScript(params.destinationAddress), params.amount)

  unspents.forEach((uns: UTXO, idx: number) => {
    txb.addInput(uns.txId, uns.index)
  })

  unspents.forEach((uns: UTXO, idx: number) => {
    txb.sign(idx, keyPair)
  })

  // TODO: calculate change

  const transactionHex = txb.build().toHex()

  // TODO: send transaction
}
