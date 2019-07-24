import {
  DecodedTx,
  Key,
  KeyType,
  Path,
  Recipient,
  TxOut,
  UTXO,
} from '../../types/domain'
import { TransactionBuilder } from 'bgoldjs-lib'
import { GetKeyBackendResponse } from '../../types/api-types/key'
import { WalletDetails, Unspents } from '../../types/domain-types/wallet'
import BigNumber from 'bignumber.js'
import { btcToSatoshi, satoshiToBtc } from '../utils/helpers'
import { decrypt } from '../crypto'
import { API_ERROR } from '../constants'
import { KeyModule } from './bitcoin-key'
import { WalletApi } from './bitcoin-wallet'
import { BitcoinBackendApi } from './bitcoin-backend-api'
import { BitcoinOperations } from './bitcoin-operations'

export interface TransactionApi {
  send(
    userToken: string,
    walletId: string,
    recipients: Recipient[],
    xprv?: string,
    passphrase?: string,
    feeRate?: number,
  ): Promise<string>
}

export const transactionApiFactory = (
  backendApi: BitcoinBackendApi,
  keyModule: KeyModule,
  bitcoin: BitcoinOperations,
  walletApi: WalletApi,
): TransactionApi => {
  const send = async (
    userToken: string,
    walletId: string,
    recipients: Recipient[],
    xprv?: string,
    passphrase?: string,
    userProvidedFeeRate?: number,
  ): Promise<string> => {
    const unspents = await walletApi.listUnspents(
      userToken,
      walletId,
      recipients,
      userProvidedFeeRate,
    )
    const wallet = await backendApi.getWallet(userToken, walletId)
    const pubKeys = wallet.keys.map((key: Key) => key.pubKey)
    const changeAddresResponse = await backendApi.createNewAddress(
      userToken,
      walletId,
      true,
    )
    const userXprv = await xprivOrGetFromServer(
      userToken,
      wallet,
      xprv,
      passphrase,
    )
    const txHex = buildTxHex(
      unspents,
      recipients,
      userXprv,
      changeAddresResponse.address,
      pubKeys,
    )
    return await backendApi.sendTransaction(userToken, walletId, txHex)
  }

  const buildTxHex = (
    unspents: Unspents,
    recipients: Recipient[],
    xprv: string,
    changeAddres: string,
    pubKeys: string[],
  ): string => {
    const txb = bitcoin.initializeTxBuilder()
    const inputs = bitcoin.sortUnspents(unspents.outputs)
    inputs.forEach((uns: UTXO) => {
      txb.addInput(uns.txHash, uns.n)
    })

    const outputs = createOutputs(unspents, recipients, changeAddres)
    outputs.forEach((out: TxOut) => {
      txb.addOutput(out.script, btcToSatoshi(out.value).toNumber())
    })

    signInputs(inputs, xprv, pubKeys, txb)
    const txHex = txb.build().toHex()
    return txHex
  }

  const xprivOrGetFromServer = async (
    userToken: string,
    wallet: WalletDetails,
    xprv?: string,
    passphrase?: string,
  ): Promise<string> => {
    if (xprv) {
      return xprv
    }

    if (passphrase) {
      return await getUserXprvFromServer(wallet, userToken, passphrase)
    }

    throw API_ERROR.XPRIV_OR_PASSWORD_REQUIRED
  }

  const getUserXprvFromServer = async (
    wallet: WalletDetails,
    userToken: string,
    password: string,
  ): Promise<string> => {
    const keyId: string = wallet.keys.find(
      (key: Key) => key.type === KeyType.USER,
    )!.id
    const { prvKey }: GetKeyBackendResponse = await backendApi.getKey(
      userToken,
      keyId,
      true,
    )

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

  const createOutputs = (
    unspents: Unspents,
    recipients: Recipient[],
    changeAddres: string,
  ): TxOut[] => {
    const { change, serviceFee } = unspents
    const changeRecipient: Recipient = {
      address: changeAddres,
      amount: new BigNumber(change),
    }
    const serviceRecipient = serviceFee
      ? [
        {
          address: serviceFee.address,
          amount: new BigNumber(serviceFee.amount),
        },
      ]
      : []
    const txOuts = recipients
      .concat(changeRecipient)
      .concat(serviceRecipient)
      .map(bitcoin.recipientToTxOut)
    return bitcoin.sortTxOuts(txOuts)
  }

  const signInputs = (
    unspents: UTXO[],
    xprv: string,
    pubKeys: string[],
    txb: TransactionBuilder,
  ) => {
    unspents.forEach((uns: UTXO, idx: number) => {
      const signingKey = keyModule.deriveKey(xprv, joinPath(uns.path!)).keyPair
      const derivedPubKeys = pubKeys.map((key: string) =>
        keyModule
          .deriveKey(key, joinPath(uns.path!))
          .neutered()
          .toBase58(),
      )
      const redeemScript = bitcoin.createMultisigRedeemScript(derivedPubKeys)
      // @ts-ignore
      bitcoin.sign(
        txb,
        idx,
        signingKey,
        new BigNumber(uns.amount || 0),
        redeemScript,
      )
    })
  }
  return { send }
}

export interface TransactionModule {
  decodeTransaction(txHex: string): DecodedTx
  signTransaction(
    xprv: string,
    txHex: string,
    unspents: UTXO[],
  ): { txHex: string; txHash: string }
}

export const transactionModuleFactory = (
  keyModule: KeyModule,
  bitcoin: BitcoinOperations,
): TransactionModule => {
  const decodeTransaction = (txHex: string): DecodedTx => {
    const tx = bitcoin.txFromHex(txHex)
    const outputs: Recipient[] = tx.outs
      .map(bitcoin.decodeTxOutput)
      .map(o => ({ ...o, amount: satoshiToBtc(o.amount) }))

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
      const signingKey = keyModule.deriveKey(xprv, joinPath(uns.path!)).keyPair
      bitcoin.sign(txb, idx, signingKey, uns.amount)
    })

    const builtTx = txb.build()

    return {
      txHex: builtTx.toHex(),
      txHash: builtTx.getId(),
    }
  }

  return { decodeTransaction, signTransaction }
}

const joinPath = (path: Path): string =>
  `${path.cosignerIndex}/${path.change}/${path.addressIndex}`
