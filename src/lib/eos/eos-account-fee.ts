import { GetAccountFee } from 'response/account-fee'
import { EosBackendApi } from './eos-backend-api'

export interface AccountFeeApi {
  getAccountFee(token: String): Promise<GetAccountFee>
}

export const accountFeeApiFactory = (
  backendApi: EosBackendApi,
): AccountFeeApi => {
  const getAccountFee = (token: string): Promise<GetAccountFee> =>
    backendApi.getAccountFee(token)
  return { getAccountFee }
}
