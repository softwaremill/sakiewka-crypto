import * as btcLib from 'bitcoinjs-lib'
import { Transaction, TransactionBuilder } from "bitcoinjs-lib";
import { BitcoinOperations } from "./bitcoin-operations";
import { network } from "./config";
import { ECPair } from "bitcoinjs-lib";
import { BigNumber } from "bignumber.js";
// import { btcToSatoshi } from "./utils/helpers";

export default class BtcOperations extends BitcoinOperations {
  protected bitcoinLib = btcLib

  sign = (txb:TransactionBuilder,idx:number,signingKey:ECPair,amount?:BigNumber,redeemScript?:Buffer) : void => {
    txb.sign(idx, signingKey,redeemScript)
  }


  initializeTxBuilder = (): TransactionBuilder => {
    return new this.bitcoinLib.TransactionBuilder(network)
  }

  txBuilderFromTx = (tx: Transaction): TransactionBuilder => {
    return btcLib.TransactionBuilder.fromTransaction(tx, network)
  }
}