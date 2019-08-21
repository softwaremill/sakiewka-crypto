import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { AuthorityProvider, BinaryAbi } from 'eosjs/dist/eosjs-api-interfaces'
import { base64ToBinary } from 'eosjs/dist/eosjs-numeric'
import moment from 'moment'
import {
  Transaction,
  TransferActionData,
} from '../../types/domain/eos/transaction'
import { PrivateKey } from 'eosjs-ecc'

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
    now?: moment.Moment,
    memo?: string,
  ): Promise<string>
  signTx(prvKey: string, serializedTransaction: string): Promise<string>
  decodeTransferTransaction(
    txHex: string,
  ): Promise<Transaction<TransferActionData>>
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
        now,
        memo,
      ),
    signTx: (prvKey: string, serializedTransaction: string) =>
      signTx(chainId, prvKey, serializedTransaction),
    decodeTransferTransaction,
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
  now?: moment.Moment,
  memo?: string,
): Promise<string> => {
  const abiProvider = {
    getRawAbi: (accountName: string): Promise<BinaryAbi> => {
      return Promise.resolve({
        abi: base64ToBinary(eosioTokenBase64Abi),
        accountName,
      })
    },
  }
  const expiration = (now || moment())
    .add(30, 'minutes')
    .toDate()
    .toString()
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
  const t = transfer(
    expiration,
    refBlockNumber,
    refBlockPrefix,
    from,
    to,
    `${amount} ${currency}`,
    memo || '', // TODO moze dac tutaj jakis random number, albo correlationId?
  )
  const response = await api.transact(t, {
    broadcast: false,
    sign: false,
  })
  return Buffer.from(response.serializedTransaction).toString('hex')
}

const transfer = (
  expiration: string,
  refBlockNumber: number,
  refBlockPrefix: number,
  from: string,
  to: string,
  quantity: string,
  memo: string,
) => ({
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
        quantity,
        memo,
      },
    },
  ],
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
