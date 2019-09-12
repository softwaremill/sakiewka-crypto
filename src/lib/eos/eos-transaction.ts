import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { AuthorityProvider, BinaryAbi } from 'eosjs/dist/eosjs-api-interfaces'
import { base64ToBinary } from 'eosjs/dist/eosjs-numeric'
import {
  Transaction,
  TransferActionData,
} from '../../types/domain/eos/transaction'
import { PrivateKey } from 'eosjs-ecc'
import { Key, KeyType } from '../../types/domain/key'

import { SendResponse } from '../../types/response/transaction'
import { EosBackendApi } from './eos-backend-api'
import { EosKeyModule } from './eos-key'
import { WalletDetails } from '../../types/domain/wallet'
import { GetKeyBackendResponse } from '../../types/api/key'
import { API_ERROR } from '../constants'
import moment from 'moment'
import { ServiceFeeData } from "../../types/response/transaction";

export interface EosTransactionApi {
  send(
    userToken: string,
    walletId: string,
    from: string,
    to: string,
    quantity: { amount: string; currency: string },
    memo?: string,
    xprv?: string,
    passphrase?: string,
  ): Promise<SendResponse>
}

export const eosTransactionApiFactory = (
  backendApi: EosBackendApi,
  keyModule: EosKeyModule,
  transactionModule: EosTransactionModule,
): EosTransactionApi => {
  const send = async (
    userToken: string,
    walletId: string,
    from: string,
    to: string,
    quantity: { amount: string; currency: string },
    memo?: string,
    xprv?: string,
    passphrase?: string,
  ): Promise<string> => {
    const wallet = await backendApi.getWallet(userToken, walletId)
    const userXprv = await xprivOrGetFromServer(
      userToken,
      wallet,
      xprv,
      passphrase,
    )
    const txParams = await backendApi.getCurrentTxParams()
    const serviceFee = await backendApi.getServiceFee(userToken,walletId,to,quantity.amount)
    const txHex = await transactionModule.createTransferTx(
      txParams.irreversibleBlockNumber,
      txParams.irreversibleBlockPrefix,
      from,
      to,
      quantity,
      serviceFee.fee,
      moment(txParams.latestBlockTime),
      memo,
    )
    const userSignature = await transactionModule.signTx(userXprv, txHex)
    return await backendApi.sendTransaction(
      userToken,
      walletId,
      txHex,
      userSignature,
    )
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
        return keyModule.decryptKey(prvKey, password)
      } catch {
        throw API_ERROR.INCORRECT_PASSPHRASE
      }
    } else {
      throw API_ERROR.NO_PRIV_KEY_ON_SERVER
    }
  }

  return { send }
}

const { TextDecoder, TextEncoder } = require('util')
// This base64 encoded eosio.token abi
// Once you install the contract you can get the base64 version by calling curl --request POST --data '{"account_name":"eosio.token"}' --url http://127.0.0.1:8888/v1/chain/get_raw_abi
const eosioTokenBase64Abi =
  'DmVvc2lvOjphYmkvMS4xAAgHYWNjb3VudAABB2JhbGFuY2UFYXNzZXQFY2xvc2UAAgVvd25lcgRuYW1lBnN5bWJvbAZzeW1ib2wGY3JlYXRlAAIGaXNzdWVyBG5hbWUObWF4aW11bV9zdXBwbHkFYXNzZXQOY3VycmVuY3lfc3RhdHMAAwZzdXBwbHkFYXNzZXQKbWF4X3N1cHBseQVhc3NldAZpc3N1ZXIEbmFtZQVpc3N1ZQADAnRvBG5hbWUIcXVhbnRpdHkFYXNzZXQEbWVtbwZzdHJpbmcEb3BlbgADBW93bmVyBG5hbWUGc3ltYm9sBnN5bWJvbAlyYW1fcGF5ZXIEbmFtZQZyZXRpcmUAAghxdWFudGl0eQVhc3NldARtZW1vBnN0cmluZwh0cmFuc2ZlcgAEBGZyb20EbmFtZQJ0bwRuYW1lCHF1YW50aXR5BWFzc2V0BG1lbW8Gc3RyaW5nBgAAAAAAhWlEBWNsb3NlAAAAAACobNRFBmNyZWF0ZQAAAAAAAKUxdgVpc3N1ZQAAAAAAADBVpQRvcGVuAAAAAACo67K6BnJldGlyZQAAAABXLTzNzQh0cmFuc2ZlcgACAAAAOE9NETIDaTY0AAAHYWNjb3VudAAAAAAAkE3GA2k2NAAADmN1cnJlbmN5X3N0YXRzAAAAAA==='

export interface EosTransactionModule {
  createTransferTx(
    refBlockNumber: number,
    refBlockPrefix: number,
    from: string,
    to: string,
    quantity: { amount: string; currency: string },
    serviceFee?: ServiceFeeData,
    now?: moment.Moment,
    memo?: string,
  ): Promise<string>
  signTx(prvKey: string, serializedTransaction: string): Promise<string>
  decodeTransferTransaction(
    txHex: string,
  ): Promise<Transaction<TransferActionData>>
  createEosTransaction(transaction: any, eisoTokenAbi: string): Promise<string>
}

export const eosTransactionModuleFactory = (
  chainId: string,
): EosTransactionModule => {
  return {
    createTransferTx: (
      refBlockNumber: number,
      refBlockPrefix: number,
      from: string,
      to: string,
      quantity: { amount: string; currency: string },
      serviceFee?: ServiceFeeData,
      now?: moment.Moment,
      memo?: string,
    ) =>
      createTransferTx(
        chainId,
        refBlockNumber,
        refBlockPrefix,
        from,
        to,
        quantity.amount,
        quantity.currency,
        serviceFee,
        now,
        memo,
      ),
    signTx: (prvKey: string, serializedTransaction: string) =>
      signTx(chainId, prvKey, serializedTransaction),
    decodeTransferTransaction,
    createEosTransaction: (transaction: any, eisoTokenAbi: string) =>
      createEosTransaction(transaction, chainId, eisoTokenAbi),
  }
}

const createTransferTx = async (
  chainId: string,
  refBlockNumber: number,
  refBlockPrefix: number,
  from: string,
  to: string,
  amount: string,
  currency: string,
  serviceFee?: ServiceFeeData,
  now?: moment.Moment,
  memo?: string,
): Promise<string> => {
  const expiration = (now || moment())
    .add(30, 'minutes')
    .toDate()
    .toString()
  const t = transfer(
    expiration,
    refBlockNumber,
    refBlockPrefix,
    from,
    to,
    amount,
    currency,
    memo || '',
    serviceFee
  )
  return createEosTransaction(t, chainId, eosioTokenBase64Abi)
}

const createEosTransaction = async (
  transaction: any,
  chainId: string,
  eisoTokenAbi: string,
) => {
  const abiProvider = {
    getRawAbi: (accountName: string): Promise<BinaryAbi> => {
      return Promise.resolve({
        abi: base64ToBinary(eisoTokenAbi),
        accountName,
      })
    },
  }
  const api = new Api({
    // @ts-ignore
    rpc: null as JsonRpc,
    // @ts-ignore
    signatureProvider: null as JsSignatureProvider,
    // @ts-ignore
    authorityProvider: null as AuthorityProvider,
    abiProvider,
    chainId,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder(),
  })
  const apiResponse = await api.transact(transaction, {
    broadcast: false,
    sign: false,
  })
  return Buffer.from(apiResponse.serializedTransaction).toString('hex')
}

const transfer = (expiration: string,
                  refBlockNumber: number,
                  refBlockPrefix: number,
                  from: string,
                  to: string,
                  amount: string,
                  currency: string,
                  memo: string,
                  serviceFee?: ServiceFeeData) => ({
  expiration,
  ref_block_num: refBlockNumber,
  ref_block_prefix: refBlockPrefix,
  actions: [
    {
      account: 'eosio.token',
      name: 'transfer',
      authorization: [
        {
          actor: from,
          permission: 'active',
        },
      ],
      data: {
        from,
        to,
        quantity: `${amount} ${currency}`,
        memo,
      },
    },
    ...(serviceFee ? [{
      account: 'eosio.token',
      name: 'transfer',
      authorization: [
        {
          actor: from,
          permission: 'active',
        },
      ],
      data: {
        from: from,
        to: serviceFee.serviceAddress,
        quantity: `${serviceFee.amount} ${currency}`,
        memo: ''
      }
    }] : [])
  ]
})

const signTx = async (
  chainId: string,
  prvKey: string,
  serializedTransaction: string,
): Promise<string> => {
  const jsSig2 = new JsSignatureProvider([prvKey])
  const s2 = await jsSig2.sign({
    chainId,
    requiredKeys: [
      PrivateKey.fromString(prvKey)
        .toPublic()
        .toString(),
    ],
    serializedTransaction: Buffer.from(serializedTransaction, 'hex'),
    abis: [],
  })
  return s2.signatures[0]
}

const decodeTransferTransaction = async (
  txHex: string,
): Promise<Transaction<TransferActionData>> => {
  const abiProvider = {
    getRawAbi: (accountName: string): Promise<BinaryAbi> => {
      return Promise.resolve({
        abi: base64ToBinary(eosioTokenBase64Abi),
        accountName,
      })
    },
  }
  const api = new Api({
    // @ts-ignore
    rpc: null as JsonRpc,
    // @ts-ignore
    signatureProvider: null as JsSignatureProvider,
    abiProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder(),
  })
  return await api.deserializeTransactionWithActions(txHex)
}
