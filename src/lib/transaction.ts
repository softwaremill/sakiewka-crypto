import { UTXO, Recipent, DecodedTx, Path, Key } from '../types/domain'
import {
  listUnspents,
  getWallet,
  createNewAddress,
  sendTransaction,
  getServiceAddress
} from './backend-api'
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

const getServicePassphrase = () => process.env.SERVICE_PASSPHRASE

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
  const recommendedFee = await getRecommendedFee()
  const unspentsResponse = await listUnspents(userToken, walletId, satoshiToBtc(outputsAmount), recommendedFee)
  const {
    outputs: unspents, change, serviceFee
  } = unspentsResponse
  const wallet = await getWallet(userToken, walletId)
  const pubKeys = wallet.keys.map((key: Key) => key.pubKey)
  const changeAddres = await createNewAddress(userToken, walletId, true)
  const serviceAddress = await getServiceAddress()

  unspents.forEach((uns: UTXO) => {
    txb.addInput(uns.txHash, uns.n)
  })

  recipents.forEach((out: Recipent) => {
    txb.addOutput(addressToOutputScript(out.address), out.amount)
  })

  txb.addOutput(addressToOutputScript(changeAddres.address), btcToSatoshi(change))
  txb.addOutput(addressToOutputScript(serviceAddress), btcToSatoshi(serviceFee))

  unspents.forEach((uns: UTXO, idx: number) => {
    const signingKey = deriveKey(xprv, joinPath(uns.path)).keyPair

    const derivedPubKeys = pubKeys.map((key: string) => deriveKey(key, joinPath(uns.path)).neutered().toBase58())
    const redeemScript = createMultisigRedeemScript(derivedPubKeys)

    txb.sign(idx, signingKey, redeemScript)
  })

  const txHex = txb.build().toHex()
  await sendTransaction(userToken, walletId, txHex)
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
