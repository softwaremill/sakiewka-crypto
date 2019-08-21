import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { AuthorityProvider, BinaryAbi } from 'eosjs/dist/eosjs-api-interfaces'
import { base64ToBinary } from 'eosjs/dist/eosjs-numeric'
import moment from 'moment'
import { PrivateKey } from 'eosjs-ecc'

const { TextDecoder, TextEncoder } = require('util')

export interface EosTransactionModule {
  createTransferTx(
    refBlockNumber: number,
    refBlockPrefix: number,
    from: string,
    to: string,
    quantity: string,
    now?: moment.Moment,
  ): Promise<string>
  signTx(prvKey: string, serializedTransaction: string): Promise<string>
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
      quantity: string,
      now?: moment.Moment,
    ) =>
      createTransferTx(
        chainId,
        refBlockNumber,
        refBlockPrefix,
        from,
        to,
        quantity,
        now,
      ),
    signTx: (prvKey: string, serializedTransaction: string) =>
      signTx(chainId, prvKey, serializedTransaction),
  }
}

const createTransferTx = async (
  chainId: string,
  refBlockNumber: number,
  refBlockPrefix: number,
  from: string,
  to: string,
  quantity: string,
  now?: moment.Moment,
): Promise<string> => {
  const abiProvider = {
    getRawAbi: (accountName: string): Promise<BinaryAbi> => {
      // This base64 encoded eosio.token abi
      // Once you install the contract you can get the base64 version by calling curl --request POST --data '{"account_name":"eosio.token"}' --url http://127.0.0.1:8888/v1/chain/get_raw_abi
      const base64Abi =
        'DmVvc2lvOjphYmkvMS4xAAgHYWNjb3VudAABB2JhbGFuY2UFYXNzZXQFY2xvc2UAAgVvd25lcgRuYW1lBnN5bWJvbAZzeW1ib2wGY3JlYXRlAAIGaXNzdWVyBG5hbWUObWF4aW11bV9zdXBwbHkFYXNzZXQOY3VycmVuY3lfc3RhdHMAAwZzdXBwbHkFYXNzZXQKbWF4X3N1cHBseQVhc3NldAZpc3N1ZXIEbmFtZQVpc3N1ZQADAnRvBG5hbWUIcXVhbnRpdHkFYXNzZXQEbWVtbwZzdHJpbmcEb3BlbgADBW93bmVyBG5hbWUGc3ltYm9sBnN5bWJvbAlyYW1fcGF5ZXIEbmFtZQZyZXRpcmUAAghxdWFudGl0eQVhc3NldARtZW1vBnN0cmluZwh0cmFuc2ZlcgAEBGZyb20EbmFtZQJ0bwRuYW1lCHF1YW50aXR5BWFzc2V0BG1lbW8Gc3RyaW5nBgAAAAAAhWlEBWNsb3NlAAAAAACobNRFBmNyZWF0ZQAAAAAAAKUxdgVpc3N1ZQAAAAAAADBVpQRvcGVuAAAAAACo67K6BnJldGlyZQAAAABXLTzNzQh0cmFuc2ZlcgACAAAAOE9NETIDaTY0AAAHYWNjb3VudAAAAAAAkE3GA2k2NAAADmN1cnJlbmN5X3N0YXRzAAAAAA==='
      return Promise.resolve({ abi: base64ToBinary(base64Abi), accountName })
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
    quantity,
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
        memo: 'x',
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

// utworzyc transakcje
// podpisac (funkcja)
// wyslac do api
// podpisac (funkcja)

/// TODO skoptiowac kod tworzenia tx, przyjac tx jako param i single key, uzyc sign = true i zrobic to dwa razy
