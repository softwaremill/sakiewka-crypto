import { UTXO, Recipient, DecodedTx, Path, Key, TxOut } from '../types/domain'
import {
  getWallet,
  createNewAddress,
  sendTransaction,
  getFeesRates
} from './backend-api'
import {
  createMultisigRedeemScript,
  initializeTxBuilder,
  txFromHex,
  decodeTxOutput,
  decodeTxInput,
  txBuilderFromTx,
  sortUnspents,
  recipientToTxOut,
  sortTxOuts
} from './bitcoin'
import { deriveKey } from './key'
import { listUnspents } from './wallet'
import { TransactionBuilder } from 'bitcoinjs-lib';
import { ListUnspentsBackendResponse } from 'response';
import BigNumber from "bignumber.js";
import { btcToSatoshi } from './utils/helpers'

const joinPath = (path: Path): string =>
  `${path.cosignerIndex}/${path.change}/${path.addressIndex}`

export const sendCoins = async (
  userToken: string, xprv: string, walletId: string, recipients: Recipient[]
): Promise<void> => {
  const txb = initializeTxBuilder()
  const { recommended } = await getFeesRates()
  const unspentsResponse = await listUnspents(userToken, walletId, recommended, recipients)
  const wallet = await getWallet(userToken, walletId)
  const pubKeys = wallet.keys.map((key: Key) => key.pubKey)
  const changeAddresResponse = await createNewAddress(userToken, walletId, true)

  const inputs = sortUnspents(unspentsResponse.outputs)
  inputs.forEach((uns: UTXO) => {
    txb.addInput(uns.txHash, uns.n)
  })

  const outputs = createOutputs(unspentsResponse, recipients, changeAddresResponse.address)
  outputs.forEach((out: TxOut) => {
    txb.addOutput(out.script, out.value.toNumber())
  })

  signInputs(inputs, xprv, pubKeys, txb)

  const txHex = txb.build().toHex()
  await sendTransaction(userToken, walletId, txHex)
}

const createOutputs = (unspentsResponse: ListUnspentsBackendResponse, recipients: Recipient[], changeAddres: string): TxOut[] => {
  const { change, serviceFee } = unspentsResponse
  const changeRecipient: Recipient = { address: changeAddres, amount: btcToSatoshi(new BigNumber(change)) }
  const serviceRecipient = serviceFee ? [{ address: serviceFee.address, amount: btcToSatoshi(new BigNumber(serviceFee.amount)) }] : []
  const txOuts = recipients.concat(changeRecipient)
    .concat(serviceRecipient)
    .map(recipientToTxOut)
  return sortTxOuts(txOuts)
}

const signInputs = (unspents: UTXO[], xprv: string, pubKeys: string[], txb: TransactionBuilder) => {
  unspents.forEach((uns: UTXO, idx: number) => {
    const signingKey = deriveKey(xprv, joinPath(uns.path!)).keyPair

    const derivedPubKeys = pubKeys.map((key: string) => deriveKey(key, joinPath(uns.path!)).neutered().toBase58())
    const redeemScript = createMultisigRedeemScript(derivedPubKeys)

    txb.sign(idx, signingKey, redeemScript)
  })
}

export const decodeTransaction = (txHex: string): DecodedTx => {
  const tx = txFromHex(txHex)
  const outputs = tx.outs.map(decodeTxOutput)

  const inputs = tx.ins.map(decodeTxInput)

  return { outputs, inputs }
}

export const signTransaction = (
  xprv: string, txHex: string, unspents: UTXO[]
) => {
  const tx = txFromHex(txHex)
  const txb = txBuilderFromTx(tx)

  unspents.forEach((uns: UTXO, idx: number) => {
    const signingKey = deriveKey(xprv, joinPath(uns.path!)).keyPair
    txb.sign(idx, signingKey)
  })

  const builtTx = txb.build()

  return {
    txHex: builtTx.toHex(),
    txHash: builtTx.getId()
  }
}
