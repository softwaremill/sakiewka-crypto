import * as btgLib from 'bgoldjs-lib'
import { Transaction, TransactionBuilder, ECPair } from "bgoldjs-lib";
import { BitcoinOperations } from "./bitcoin-operations";
import { networkFactory } from "./config";
import { btcToSatoshi } from "./utils/helpers";
import BigNumber from "bignumber.js";
import { Currency } from '../types/domain';


export default class BtgOperations extends BitcoinOperations {
  protected bitcoinLib = btgLib
  protected currency: Currency = Currency.BTG

  sign = (txb: TransactionBuilder, idx: number, signingKey: ECPair, amount?: BigNumber, redeemScript?: Buffer): void => {
    const hashType = Transaction.SIGHASH_ALL | Transaction.SIGHASH_FORKID
    txb.sign(idx, signingKey, redeemScript, hashType, btcToSatoshi(amount).toNumber())
  }

  initializeTxBuilder = (): TransactionBuilder => {
    const txb = new this.bitcoinLib.TransactionBuilder(networkFactory(this.btcNetwork, this.currency))
    txb.setVersion(2)
    txb.enableBitcoinGold(true)
    return txb
  }

  txBuilderFromTx = (tx: Transaction): TransactionBuilder => {
    const forkid = Transaction.FORKID_BTG;
    return btgLib.TransactionBuilder.fromTransaction(tx, networkFactory(this.btcNetwork, this.currency), forkid)
  }
}