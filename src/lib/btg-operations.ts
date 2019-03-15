import * as btgLib from 'bgoldjs-lib'
import { Transaction, TransactionBuilder } from "bgoldjs-lib";
import { BitcoinOperations } from "./bitcoin-operations";
import { network } from "./config";
// import { btcToSatoshi } from "./utils/helpers";
import BigNumber from "bignumber.js";
import { ECPair } from "bitcoinjs-lib";


export default class BtgOperations extends BitcoinOperations {
  protected bitcoinLib = btgLib

  sign = (txb:TransactionBuilder,idx:number,signingKey:ECPair,amount?:BigNumber,redeemScript?:Buffer) : void => {
    const hashType = Transaction.SIGHASH_ALL | Transaction.SIGHASH_FORKID
    // @ts-ignore
    txb.sign(idx, signingKey, redeemScript, hashType, new BigNumber(amount || -1).toNumber()) //TODO - btcToSatoshi w testach nie powinno byc ale na prodzie tak - zła wartość wysyłana przez api?
  }


  initializeTxBuilder = (): TransactionBuilder => {
    const txb = new this.bitcoinLib.TransactionBuilder(network)
    txb.setVersion(2)
    txb.enableBitcoinGold(true)
    return txb
  }

  txBuilderFromTx = (tx: Transaction): TransactionBuilder => {
    const forkid = Transaction.FORKID_BTG;
    return btgLib.TransactionBuilder.fromTransaction(tx, network, forkid)
  }
}