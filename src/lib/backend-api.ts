import {
  Confirm2faBackendResponse,
  CreateNewAddressBackendResponse,
  CreateWalletBackendParams,
  CreateWalletBackendResponse,
  Disable2faBackendResponse,
  GetAddressBackendResponse,
  GetFeesRates,
  GetKeyBackendResponse,
  GetWalletBackendResponse,
  GetWalletBalanceBackendResponse,
  InfoBackendResponse,
  Init2faBackendResponse,
  ListAddressesBackendResponse,
  ListUnspentsBackendResponse,
  ListWalletsBackendResponse,
  LoginBackendResponse,
  RegisterBackendResponse,
  GetUtxosBackendParams,
  MaxTransferAmountParams,
  MaxTransferAmountResponse,
  MontlySummaryBackendResponse,
  SetupPasswordBackendResponse,
  ListTransfersBackendResponse
} from 'response'
import request from './utils/request'
import { Currency } from "../types/domain";


const getBackendApiUrl = () => process.env.BACKEND_API_URL

// BTC
// user
export const login = async (login: string, password: string, codeIn?: number): Promise<LoginBackendResponse> => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      password,
      email: login,
      code: codeIn
    })
  }
  const response = await request(`${getBackendApiUrl()}/user/login`, options)
  return response.data
}

export const init2fa = async (token: string, password: string): Promise<Init2faBackendResponse> => {
  const options = {
    method: 'POST',
    headers: {
      Authorization: token
    },
    body: JSON.stringify({ password })
  }
  const response = await request(`${getBackendApiUrl()}/user/2fa/init`, options)
  return response.data
}

export const confirm2fa = async (token: string, password: string, code: number): Promise<Confirm2faBackendResponse> => {
  const options = {
    method: 'POST',
    headers: {
      Authorization: token
    },
    body: JSON.stringify({ password, code })
  }
  const response = await request(`${getBackendApiUrl()}/user/2fa/confirm`, options)
  return response.data
}

export const disable2fa = async (token: string, password: string, code: number): Promise<Disable2faBackendResponse> => {
  const options = {
    method: 'POST',
    headers: {
      Authorization: token
    },
    body: JSON.stringify({ password, code })
  }
  const response = await request(`${getBackendApiUrl()}/user/2fa/disable`, options)
  return response.data
}

export const register = async (login: string): Promise<RegisterBackendResponse> => {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      email: login
    })
  }

  const response = await request(`${getBackendApiUrl()}/user/register`, options)
  return response.data
}

export const setupPassword = async (token: string, password: String): Promise<SetupPasswordBackendResponse> => {
  const options = {
    method: 'POST',
    headers: {
      Authorization: token
    },
    body: JSON.stringify({
      password
    })
  }
  const response = await request(`${getBackendApiUrl()}/user/setup-password`, options)
  return response.data
}

export const info = async (token: string): Promise<InfoBackendResponse> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: token
    }
  }

  const response = await request(`${getBackendApiUrl()}/user/info`, options)
  return response.data
}

export const monthlySummary = async (token: string, month: number, year: number, fiatCurrency: number): Promise<MontlySummaryBackendResponse> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: token
    }
  }

  const response = await request(`${getBackendApiUrl()}/transfers/monthly-summary/${month}/${year}/${fiatCurrency}`, options)
  return response.data
}

export const listTransfers = async (token: string,
                                    walletId: string,
                                    limit: number,
                                    nextPageToken?: string): Promise<ListTransfersBackendResponse> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: token
    }
  }

  const nextPageParam = nextPageToken ? `&nextPageToken=${nextPageToken}` : ''
  const walletIdParam = walletId ? `&walletId=${walletId}` : ''
  const queryString = `?limit=${limit}${nextPageParam}${walletIdParam}`

  const response = await request(`${getBackendApiUrl()}/transfers${queryString}`, options)
  return response.data
}

export const withCurrency = (currency: Currency) => {
  // wallet
  const createWallet = async (
    token: string,
    params: CreateWalletBackendParams
  ): Promise<CreateWalletBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({
        ...params
      })
    }

    const response = await request(`${getBackendApiUrl()}/${currency}/wallet`, options)
    return response.data
  }

  const getWallet = async (
    token: string,
    walletId: string
  ): Promise<GetWalletBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const response = await request(`${getBackendApiUrl()}/${currency}/wallet/${walletId}`, options)
    return response.data
  }

  const listWallets = async (
    token: string,
    limit: number,
    nextPageToken?: string
  ): Promise<ListWalletsBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const queryString = `limit=${limit}${nextPageToken ? `&nextPageToken=${nextPageToken}` : ''}`

    const response = await request(`${getBackendApiUrl()}/${currency}/wallet?${queryString}`, options)
    return response.data
  }

  const getWalletBalance = async (
    token: string,
    walletId: string
  ): Promise<GetWalletBalanceBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const response = await request(`${getBackendApiUrl()}/${currency}/wallet/${walletId}/balance`, options)
    return response.data
  }

  const createNewAddress = async (token: string, walletId: string, change: boolean = false, name?: string
  ): Promise<CreateNewAddressBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({
        name
      })
    }

    const response = await request(`${getBackendApiUrl()}/${currency}/wallet/${walletId}/address?change=${change}`, options)
    return response.data
  }

  const getAddress = async (token: string, walletId: string, address: string): Promise<GetAddressBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const response = await request(`${getBackendApiUrl()}/${currency}/wallet/${walletId}/address/${address}`, options)
    return response.data
  }

  const listAddresses = async (
    token: string,
    walletId: string,
    limit: number,
    nextPageToken?: string
  ): Promise<ListAddressesBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const queryString = `limit=${limit}${nextPageToken ? `&nextPageToken=${nextPageToken}` : ''}`

    const response = await request(`${getBackendApiUrl()}/${currency}/wallet/${walletId}/address?${queryString}`, options)
    return response.data
  }

  const listUnspents = async (token: string, walletId: string, params: GetUtxosBackendParams): Promise<ListUnspentsBackendResponse> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({
        ...params
      })
    }

    const response = await request(`${getBackendApiUrl()}/${currency}/wallet/${walletId}/utxo`, options)
    return response.data
  }

  // transaction
  const sendTransaction = async (token: string, walletId: string, txHex: string): Promise<string> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: token
      },
      body: JSON.stringify({
        txHex
      })
    }

    const response = await request(`${getBackendApiUrl()}/${currency}/wallet/${walletId}/send`, options)
    return response.data
  }

  const getKey = async (
    token: string,
    keyId: string,
    includePrivate?: boolean
  ): Promise<GetKeyBackendResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const response = await request(`${getBackendApiUrl()}/${currency}/key/${keyId}${includePrivate ? `?includePrivate=${includePrivate}` : ''}`, options)
    return response.data
  }

  const maxTransferAmount = async (token: string, walletId: string, params: MaxTransferAmountParams): Promise<MaxTransferAmountResponse> => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    const response = await request(`${getBackendApiUrl()}/${currency}/wallet/${walletId}/max-transfer-amount?recipient=${params.recipient}&feeRate=${params.feeRate}`, options)
    return response.data
  }


  return {
    confirm2fa,
    createNewAddress,
    createWallet,
    getAddress,
    getKey,
    getWallet,
    getWalletBalance,
    listAddresses,
    listUnspents,
    listWallets,
    sendTransaction,
    getFeesRates,
    disable2fa,
    getBackendApiUrl,
    info,
    init2fa,
    listTransfers,
    login,
    maxTransferAmount,
    monthlySummary,
    register,
    setupPassword
  }
}

export const getFeesRates = async (): Promise<GetFeesRates> => {
  const response = await request(`${getBackendApiUrl()}/fees`, { method: 'GET' })
  return response.data
}