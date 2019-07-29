import {
  EthGetTransactionParamsBackendResponse,
  SendETHBackendResponse,
  SendTokensBackendResponse,
} from '../../types/api/transaction'
import { createHttpClient } from '../utils/httpClient'

const getZlevatorUrl = () => process.env.ZLEVATOR_URL

export const httpClient = createHttpClient(() => '')

// ETH
// transaction
export const getNextNonce = async (): Promise<
  EthGetTransactionParamsBackendResponse
> => {
  const options = {
    method: 'GET',
  }

  return await httpClient.request(`${getZlevatorUrl()}/withdraw/new`, options)
}

export const sendETH = async (
  address: string,
  value: string,
  expireBlock: number,
  contractNonce: string,
  data: string,
  signature: string,
  withdrawalId: string,
): Promise<SendETHBackendResponse> => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      withdrawalId,
      address,
      expireBlock,
      contractNonce,
      signature,
      data,
      value,
    }),
  }

  return await httpClient.request(`${getZlevatorUrl()}/withdraw/eth`, options)
}

export const sendTokens = async (
  address: string,
  value: string,
  expireBlock: number,
  contractNonce: string,
  signature: string,
  contractAddress: string,
  withdrawalId: string,
): Promise<SendTokensBackendResponse> => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      withdrawalId,
      address,
      expireBlock,
      contractNonce,
      signature,
      contractAddress,
      value,
    }),
  }
  return await httpClient.request(
    `${getZlevatorUrl()}/withdraw/tokens`,
    options,
  )
}
