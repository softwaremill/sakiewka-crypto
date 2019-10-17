import { ListTransfersResponse } from '../../types/response/transfer'
import {
  FindEosTransferByTxHashResponse,
  ListEosTransfersResponse,
} from '../../types/response/eos/eos-transfer'
import { EosBackendApi } from './eos-backend-api'

export interface EosChainTransfersApi {
  listTransfers(
    token: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListEosTransfersResponse>

  findTransferByTxHash(
    token: string,
    walletId: string,
    txHash: string,
  ): Promise<FindEosTransferByTxHashResponse>
}

export const eosChainTransferApiFactory = (
  backend: EosBackendApi,
): EosChainTransfersApi => {
  const listTransfers = async (
    token: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListTransfersResponse> => {
    return backend.listTransfers(token, walletId, limit, nextPageToken)
  }

  const findTransferByTxHash = async (
    token: string,
    walletId: string,
    txHash: string,
  ): Promise<FindEosTransferByTxHashResponse> => {
    return backend.findTransferByTxHash(token, walletId, txHash)
  }

  return {
    listTransfers,
    findTransferByTxHash,
  }
}
