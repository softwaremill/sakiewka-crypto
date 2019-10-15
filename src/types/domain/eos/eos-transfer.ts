import { TransferDataFlow, TransferTypes } from 'domain/transfer'

export interface EosTransfer {
  id: string
  userId: string
  walletId: string
  walletName: string
  txHash: string
  minedInBlockHash?: string
  minedInBlockNumber?: string
  irreversible: boolean
  balanceAfter: string
  timestamp: string
  actions: EosAction[]
  inputRecipients: TransferDataFlow
  outputRecipients: TransferDataFlow
}

export interface EosTransferHistoryItem {
  transferId: string
  timestamp: string
  blockHash?: string
  blockNumber?: string
  type: TransferTypes
}

export interface EosAction {}

export interface EosActionTransfer extends EosAction {
  from: string
  to: string
  amount: string
  memo: string
}
