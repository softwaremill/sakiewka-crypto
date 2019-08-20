import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import {
  AuthorityProvider,
  AuthorityProviderArgs,
  BinaryAbi,
} from 'eosjs/dist/eosjs-api-interfaces'
import { base64ToBinary } from 'eosjs/dist/eosjs-numeric'
import moment from 'moment'
import { PrivateKey } from 'eosjs-ecc'

const { TextDecoder, TextEncoder } = require('util')

export interface EosTransactionModule {
  transfer(
    privateKeys: string[],
    refBlockNumber: number,
    refBlockPrefix: number,
    from: string,
    to: string,
    quantity: string,
    now?: moment.Moment,
  ): Promise<any>
}

export const eosTransactionModuleFactory = (
  chainId: string,
): EosTransactionModule => {
  return {
    transfer: (
      privateKeys: string[],
      refBlockNumber: number,
      refBlockPrefix: number,
      from: string,
      to: string,
      quantity: string,
      now?: moment.Moment,
    ) =>
      packedTransfer(
        chainId,
        privateKeys,
        refBlockNumber,
        refBlockPrefix,
        from,
        to,
        quantity,
        now,
      ),
  }
}

const packedTransfer = async (
  chainId: string,
  privateKeys: string[],
  refBlockNumber: number,
  refBlockPrefix: number,
  from: string,
  to: string,
  quantity: string,
  now?: moment.Moment,
) => {
  const creatorPublicKeys = privateKeys.map(pk =>
    PrivateKey.fromString(pk)
      .toPublic()
      .toString(),
  )
  console.log('pubkey', creatorPublicKeys)
  const signatureProvider = new JsSignatureProvider(privateKeys)
  const authorityProvider: AuthorityProvider = {
    getRequiredKeys: (args: AuthorityProviderArgs): Promise<string[]> => {
      return Promise.resolve(creatorPublicKeys)
    },
  }
  const abiProvider = {
    getRawAbi: (accountName: string): Promise<BinaryAbi> => {
      // This base64 encoded eosio abi with system contract installed (required for buyrambytes and delegatebw actions) - https://github.com/EOS-Mainnet/governance/tree/master/eosio.system
      // Once you install the contract you can get the base64 version by calling curl --request POST --data '{"account_name":"eosio"}' --url http://127.0.0.1:8888/v1/chain/get_raw_abi
      const base64Abi =
        'DmVvc2lvOjphYmkvMS4xAAgHYWNjb3VudAABB2JhbGFuY2UFYXNzZXQFY2xvc2UAAgVvd25lcgRuYW1lBnN5bWJvbAZzeW1ib2wGY3JlYXRlAAIGaXNzdWVyBG5hbWUObWF4aW11bV9zdXBwbHkFYXNzZXQOY3VycmVuY3lfc3RhdHMAAwZzdXBwbHkFYXNzZXQKbWF4X3N1cHBseQVhc3NldAZpc3N1ZXIEbmFtZQVpc3N1ZQADAnRvBG5hbWUIcXVhbnRpdHkFYXNzZXQEbWVtbwZzdHJpbmcEb3BlbgADBW93bmVyBG5hbWUGc3ltYm9sBnN5bWJvbAlyYW1fcGF5ZXIEbmFtZQZyZXRpcmUAAghxdWFudGl0eQVhc3NldARtZW1vBnN0cmluZwh0cmFuc2ZlcgAEBGZyb20EbmFtZQJ0bwRuYW1lCHF1YW50aXR5BWFzc2V0BG1lbW8Gc3RyaW5nBgAAAAAAhWlEBWNsb3NlAAAAAACobNRFBmNyZWF0ZQAAAAAAAKUxdgVpc3N1ZQAAAAAAADBVpQRvcGVuAAAAAACo67K6BnJldGlyZQAAAABXLTzNzQh0cmFuc2ZlcgACAAAAOE9NETIDaTY0AAAHYWNjb3VudAAAAAAAkE3GA2k2NAAADmN1cnJlbmN5X3N0YXRzAAAAAA==='
      return Promise.resolve({ abi: base64ToBinary(base64Abi), accountName })
    },
  }
  const expiration = (now || moment())
    .add(30, 'minutes')
    .toDate()
    .toString()
  const rpc = new JsonRpc('http://should-never-be-called') // The transaction is created offline but eosjs api requires providing nodeos url
  const api = new Api({
    rpc,
    signatureProvider,
    authorityProvider,
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
  return {
    serializedTransaction: response.serializedTransaction,
  }
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

// utworzyc transakcje
// podpisac (funkcja)
// wyslac do api
// podpisac (funkcja)
