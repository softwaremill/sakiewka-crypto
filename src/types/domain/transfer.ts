import { Currency } from './currency'

export enum TransferTypes {
  CREATED = 'created',
  MINED = 'mined',
  REMOVED = 'removed',
}

interface TransferWalletData {
  id: string
  balance: string
  name: string
}

interface TransferBlockData {
  hash: string
  number: number
  timestamp: string
}

export interface TransferDataFlowItem {
  [hash: string]: string
}

interface TransferDataFlow {
  wallet?: TransferDataFlowItem
  service?: TransferDataFlowItem
  other?: TransferDataFlowItem
}

export interface TransferHistory {
  timestamp: string
  type: TransferTypes
  block?: {
    hash: string;
    number: number;
    timestamp: string;
  }
}

export interface TransferTransactionData {
  hash: string
  inputs: TransferDataFlow
  outputs: TransferDataFlow
}

export interface Transfer {
  chain?: string
  wallet: TransferWalletData
  timestamp: string
  transaction: TransferTransactionData
  block: TransferBlockData
}

export interface TransferDetails extends Transfer {
  history: TransferHistory[]
}

export interface MonthlySummary {
  chain: Currency
  totalOutputsOther: string
  totalOutputsWallet: string
  totalOutputsService: string
  totalOutputsOtherInFiat: string
  totalOutputsWalletInFiat: string
  totalOutputsServiceInFiat: string
}
