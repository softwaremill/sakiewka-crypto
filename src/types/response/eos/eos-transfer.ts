import { EosTransfer, EosTransferHistoryItem } from 'domain/eos/eos-transfer'
import { Transfer } from 'domain/transfer'

export type ListEosTransfersResponse = {
  transfers: Transfer[]
  nextPageToken?: string
}

export type FindEosTransferByTxHashResponse = {
  transfer: EosTransfer
  history: EosTransferHistoryItem
}
