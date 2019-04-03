import * as btcLib from 'bitcoinjs-lib'
import { ECPair, Transaction, TransactionBuilder } from 'bitcoinjs-lib'
import { BitcoinOperations } from "./bitcoin-operations";
import { networkFactory } from "./config";
import { BigNumber } from "bignumber.js";
import { Currency } from '../types/domain';

export default class BtcOperations extends BitcoinOperations {
  protected bitcoinLib = btcLib
  protected currency: Currency = Currency.BTC

  sign = (txb: TransactionBuilder, idx: number, signingKey: ECPair, amount?: BigNumber, redeemScript?: Buffer): void => {
    txb.sign(idx, signingKey, redeemScript)
  }

  initializeTxBuilder = (): TransactionBuilder => {
    return new this.bitcoinLib.TransactionBuilder(networkFactory(this.btcNetwork, this.currency))
  }

  txBuilderFromTx = (tx: Transaction): TransactionBuilder => {
    return btcLib.TransactionBuilder.fromTransaction(tx, networkFactory(this.btcNetwork, this.currency))
  }
}