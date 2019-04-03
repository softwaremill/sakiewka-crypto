import { Currency, DecodedTx, Key, KeyType, Path, Recipient, TxOut, UTXO } from '../types/domain'
import { TransactionBuilder } from 'bgoldjs-lib';
import { GetKeyBackendResponse, GetWalletBackendResponse, ListUnspentsBackendResponse } from 'response';
import BigNumber from "bignumber.js";
import { btcToSatoshi, satoshiToBtc } from './utils/helpers'
import { decrypt } from './crypto';
import { API_ERROR } from './constants';
import * as backendApiFactory from './backend-api'
import bitcoinFactory from './bitcoin'
import keyFactory from './key'
import walletApiFactory from './wallet'


export default (backendApiUrl: string, currency: Currency, btcNetwork: string) => {
  const backendApi = backendApiFactory.withCurrency(backendApiUrl, currency)
  const bitcoin = bitcoinFactory(currency, btcNetwork)
  const keyApi = keyFactory(backendApiUrl, currency, btcNetwork)
  const walletApi = walletApiFactory(backendApiUrl, currency, btcNetwork)

  const joinPath = (path: Path): string =>
    `${path.cosignerIndex}/${path.change}/${path.addressIndex}`

  const send = async (
    userToken: string, walletId: string, recipients: Recipient[], xprv?: string, passphrase?: string
  ): Promise<string> => {
    const { recommended } = await backendApi.getFeesRates()
    const unspentsResponse = await walletApi.listUnspents(userToken, walletId, recommended, recipients)
    const wallet = await backendApi.getWallet(userToken, walletId)
    const pubKeys = wallet.keys.map((key: Key) => key.pubKey)
    const changeAddresResponse = await backendApi.createNewAddress(userToken, walletId, true)
    const userXprv = await xprivOrGetFromServer(userToken, wallet, xprv, passphrase)
    const txHex = buildTxHex(unspentsResponse, recipients, userXprv, changeAddresResponse.address, pubKeys)
    return await backendApi.sendTransaction(userToken, walletId, txHex)
  }

  const buildTxHex = (unspentsResponse: ListUnspentsBackendResponse, recipients: Recipient[], xprv: string, changeAddres: string, pubKeys: string[]): string => {
    const txb = bitcoin.initializeTxBuilder()
    const inputs = bitcoin.sortUnspents(unspentsResponse.outputs)
    inputs.forEach((uns: UTXO) => {
      txb.addInput(uns.txHash, uns.n)
    })

    const outputs = createOutputs(unspentsResponse, recipients, changeAddres)
    outputs.forEach((out: TxOut) => {
      txb.addOutput(out.script, btcToSatoshi(out.value).toNumber())
    })

    signInputs(inputs, xprv, pubKeys, txb)
    let txHex = txb.build().toHex();
    return txHex
  }

  const xprivOrGetFromServer = async (userToken: string, wallet: GetWalletBackendResponse, xprv?: string, passphrase?: string): Promise<string> => {
    if (xprv) {
      return xprv
    } else if (passphrase) {
      return await getUserXprvFromServer(wallet, userToken, passphrase)
    } else {
      throw API_ERROR.XPRIV_OR_PASSWORD_REQUIRED
    }
  }

  const getUserXprvFromServer = async (wallet: GetWalletBackendResponse, userToken: string, password: string): Promise<string> => {
    const keyId: string = wallet.keys.find(key => key.type === KeyType.USER)!.id
    const key: GetKeyBackendResponse = await backendApi.getKey(userToken, keyId, true)
    const prvKey = key.prvKey
    if (prvKey) {
      try {
        return decrypt(password, prvKey)
      } catch {
        throw API_ERROR.INCORRECT_PASSPHRASE
      }
    } else {
      throw API_ERROR.NO_PRIV_KEY_ON_SERVER
    }
  }

  const createOutputs = (unspentsResponse: ListUnspentsBackendResponse, recipients: Recipient[], changeAddres: string): TxOut[] => {
    const { change, serviceFee } = unspentsResponse
    const changeRecipient: Recipient = { address: changeAddres, amount: new BigNumber(change) }
    const serviceRecipient = serviceFee ? [{
      address: serviceFee.address,
      amount: new BigNumber(serviceFee.amount)
    }] : []
    const txOuts = recipients.concat(changeRecipient)
      .concat(serviceRecipient)
      .map(bitcoin.recipientToTxOut)
    return bitcoin.sortTxOuts(txOuts)
  }

  const signInputs = (unspents: UTXO[], xprv: string, pubKeys: string[], txb: TransactionBuilder) => {
    unspents.forEach((uns: UTXO, idx: number) => {
      const signingKey = keyApi.deriveKey(xprv, joinPath(uns.path!)).keyPair
      const derivedPubKeys = pubKeys.map((key: string) => keyApi.deriveKey(key, joinPath(uns.path!)).neutered().toBase58())
      const redeemScript = bitcoin.createMultisigRedeemScript(derivedPubKeys)
      // @ts-ignore
      bitcoin.sign(txb, idx, signingKey, new BigNumber(uns.amount), redeemScript)
    })
  }

  const decodeTransaction = (txHex: string): DecodedTx => {
    const tx = bitcoin.txFromHex(txHex)
    const outputs: Recipient[] = tx.outs
      .map(bitcoin.decodeTxOutput)
      .map(o => ({ ...o, amount: satoshiToBtc(o.amount) }));

    const inputs: UTXO[] = tx.ins.map(bitcoin.decodeTxInput)

    return { outputs, inputs }
  }

  const signTransaction = (xprv: string, txHex: string, unspents: UTXO[]) => {
    const tx = bitcoin.txFromHex(txHex)

    unspents.forEach((uns: UTXO, idx: number) => {
      // @ts-ignore
      tx.ins[idx].value = btcToSatoshi(uns.amount).toNumber()
    })

    const txb = bitcoin.txBuilderFromTx(tx)

    unspents.forEach((uns: UTXO, idx: number) => {
      const signingKey = keyApi.deriveKey(xprv, joinPath(uns.path!)).keyPair
      bitcoin.sign(txb, idx, signingKey, uns.amount)
    })

    const builtTx = txb.build()

    return {
      txHex: builtTx.toHex(),
      txHash: builtTx.getId()
    }
  }

  return { send, decodeTransaction, signTransaction }
}
