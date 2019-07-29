import { BigNumber } from 'bignumber.js'

export interface UTXO {
  txHash: string
  n: number
  amount?: BigNumber
  path?: Path
}

export interface Receipient {
  address: string
  amount: BigNumber
}

export interface DecodedTx {
  outputs: Receipient[]
  inputs: UTXO[]
}

export interface Path {
  cosignerIndex: number
  change: number
  addressIndex: number
}

export interface Signature {
  operationHash: string
  signature: string
  contractNonce: number
}

export interface TxOut {
  script: Buffer
  value: BigNumber
}
