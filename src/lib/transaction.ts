import { UTXO, Recipent, DecodedTx, Path, Key, TxOut } from '../types/domain'
import {
  listUnspents,
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
  recipentToTxOut,
  sortTxOuts
} from './bitcoin'
import { deriveKey } from './key'
import { TransactionBuilder } from 'bitcoinjs-lib';
import { ListUnspentsBackendResponse } from 'response';

export const sumOutputAmounts = (outputs: Recipent[]): number => {
  return outputs.reduce(
    (acc: number, out: Recipent) => {
      return acc + out.amount
    },
    0
  )
}

const joinPath = (path: Path): string =>
  `${path.cosignerIndex}/${path.change}/${path.addressIndex}`

const btcToSatoshi = (amount: number | string) => Number(amount) * 100000000
const satoshiToBtc = (amount: number | string) => Number(amount) * 0.00000001

export const sendCoins = async (
  userToken: string, xprv: string, walletId: string, recipents: Recipent[]
): Promise<void> => {
  const outputsAmount = sumOutputAmounts(recipents)
  const txb = initializeTxBuilder()
  const { recommended } = await getFeesRates()
  const unspentsResponse = await listUnspents(userToken, walletId, satoshiToBtc(outputsAmount), recommended)
  const wallet = await getWallet(userToken, walletId)
  const pubKeys = wallet.keys.map((key: Key) => key.pubKey)
  const changeAddresResponse = await createNewAddress(userToken, walletId, true)

  const inputs = sortUnspents(unspentsResponse.outputs)
  inputs.forEach((uns: UTXO) => {
    txb.addInput(uns.txHash, uns.n)
  })

  const outputs = createOutputs(unspentsResponse, recipents, changeAddresResponse.address)
  outputs.forEach((out: TxOut) => {
    txb.addOutput(out.script, out.value)
  })

  signInputs(inputs, xprv, pubKeys, txb)

  const txHex = txb.build().toHex()
  await sendTransaction(userToken, walletId, txHex)
}

const createOutputs = (unspentsResponse: ListUnspentsBackendResponse, recipents: Recipent[], changeAddres: string): TxOut[] => {
  const { change, serviceFee, serviceAddress } = unspentsResponse
  const changeRecipent: Recipent = { address: changeAddres, amount: btcToSatoshi(change) }
  const serviceRecipent: Recipent = { address: serviceAddress, amount: btcToSatoshi(serviceFee) }
  const txOuts = recipents.concat(changeRecipent, serviceRecipent).map(recipentToTxOut)
  return sortTxOuts(txOuts)
}

const signInputs = (unspents: UTXO[], xprv: string, pubKeys: string[], txb: TransactionBuilder) => {
  unspents.forEach((uns: UTXO, idx: number) => {
    const signingKey = deriveKey(xprv, joinPath(uns.path)).keyPair

    const derivedPubKeys = pubKeys.map((key: string) => deriveKey(key, joinPath(uns.path)).neutered().toBase58())
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
    const signingKey = deriveKey(xprv, joinPath(uns.path)).keyPair
    txb.sign(idx, signingKey)
  })

  const builtTx = txb.build()

  return {
    txHex: builtTx.toHex(),
    txHash: builtTx.getId()
  }
}
