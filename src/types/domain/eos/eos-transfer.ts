import { TransferDataFlow, TransferTypes } from 'domain/transfer'
import { TransferActionData } from 'domain/eos/transaction'

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
  actions: TransferActionData[]
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
