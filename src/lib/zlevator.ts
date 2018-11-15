import {
  EthGetTransactionParamsResponse,
  SendETHResponse,
  SendTokensResponse
} from 'response'
import request from './utils/request'

const getZlevatorUrl = () => process.env.ZLEVATOR_URL

// ETH
// transaction
export const getNextNonce = async (): Promise<EthGetTransactionParamsResponse> => {
  const options = {
    method: 'GET'
  }

  return await request(`${getZlevatorUrl()}/withdraw/new`, options)
}

export const sendETH = async (
  address: string, value: number, expireBlock: number, contractNonce: string, data: string, signature: string,
  withdrawalId: string
): Promise<SendETHResponse> => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      withdrawalId,
      address,
      expireBlock,
      contractNonce,
      signature,
      data,
      value: value.toString()
    })
  }

  return await request(`${getZlevatorUrl()}/withdraw/eth`, options)
}

export const sendTokens = async (
  address: string, value: number, expireBlock: number, contractNonce: string, signature: string, contractAddress: string,
  withdrawalId: string
): Promise<SendTokensResponse> => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      withdrawalId,
      address,
      expireBlock,
      contractNonce,
      signature,
      contractAddress,
      value: value.toString()
    })
  }
  return await request(`${getZlevatorUrl()}/withdraw/tokens`, options)
}
