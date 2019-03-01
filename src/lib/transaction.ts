import { UTXO, Recipient, DecodedTx, Path, Key, TxOut, KeyType } from '../types/domain'
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
import { deriveKey, getKey } from './key'
import { listUnspents } from './wallet'
import { TransactionBuilder } from 'bitcoinjs-lib';
import { ListUnspentsBackendResponse, GetWalletBackendResponse, GetKeyBackendResponse } from 'response';
import BigNumber from "bignumber.js";
import { btcToSatoshi, satoshiToBtc } from './utils/helpers'
import { decrypt } from './crypto';
import { ErrorResponse } from '../types/response'

const joinPath = (path: Path): string =>
  `${path.cosignerIndex}/${path.change}/${path.addressIndex}`

export const send = async (
  userToken: string, walletId: string, recipients: Recipient[], xprv?: string, passphrase?: string
): Promise<string> => {
  const { recommended } = await getFeesRates()
  const unspentsResponse = await listUnspents(userToken, walletId, recommended, recipients)
  const wallet = await getWallet(userToken, walletId)
  const pubKeys = wallet.keys.map((key: Key) => key.pubKey)
  const changeAddresResponse = await createNewAddress(userToken, walletId, true)
  const userXprv = await xprivOrGetFromServer(userToken, wallet, xprv, passphrase)
  const txHex = buildTxHex(unspentsResponse, recipients, userXprv, changeAddresResponse.address, pubKeys)
  return await sendTransaction(userToken, walletId, txHex)
}

const buildTxHex = (unspentsResponse: ListUnspentsBackendResponse, recipients: Recipient[], xprv: string, changeAddres: string, pubKeys: string[]): string => {
  const txb = initializeTxBuilder()
  const inputs = sortUnspents(unspentsResponse.outputs)
  inputs.forEach((uns: UTXO) => {
    txb.addInput(uns.txHash, uns.n)
  })

  const outputs = createOutputs(unspentsResponse, recipients, changeAddres)
  outputs.forEach((out: TxOut) => {
    txb.addOutput(out.script, out.value.toNumber())
  })

  signInputs(inputs, xprv, pubKeys, txb)
  return txb.build().toHex()
}

const xprivOrGetFromServer = async (userToken: string, wallet: GetWalletBackendResponse, xprv?: string, passphrase?: string): Promise<string> => {
  if (xprv) {
    return xprv
  } else if (passphrase) {
    return await getUserXprvFromServer(wallet, userToken, passphrase)
  } else {
    throw <ErrorResponse>({ message: "Password or xprv has to be specified!", code: 400 })
  }
}

const getUserXprvFromServer = async (wallet: GetWalletBackendResponse, userToken: string, password: string): Promise<string> => {
  const keyId: string = wallet.keys.find(key => key.type === KeyType.USER)!.id
  const key: GetKeyBackendResponse = await getKey(userToken, keyId, true)
  const prvKey = key.prvKey
  if (prvKey) {
    try {
      return decrypt(password, prvKey)
    } catch {
      throw <ErrorResponse>({ message: "Incorrect passphrase", code: 400 })
    }
  } else {
    throw <ErrorResponse>({ message: "There is no private key on server!", code: 400 })
  }
}

const createOutputs = (unspentsResponse: ListUnspentsBackendResponse, recipients: Recipient[], changeAddres: string): TxOut[] => {
  const { change, serviceFee } = unspentsResponse
  const changeRecipient: Recipient = { address: changeAddres, amount: btcToSatoshi(new BigNumber(change)) }
  const serviceRecipient = serviceFee ? [{
    address: serviceFee.address,
    amount: btcToSatoshi(new BigNumber(serviceFee.amount))
  }] : []
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
  const outputs: Recipient[] = tx.outs
    .map(decodeTxOutput)
    .map(o => ({ ...o, amount: satoshiToBtc(o.amount) }));

  const inputs: UTXO[] = tx.ins.map(decodeTxInput)

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
