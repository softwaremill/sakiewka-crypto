import { GetAccountFee, GetReferentialAccountId } from 'response/account-fee'
import { EosBackendApi } from './eos-backend-api'

export interface AccountFeeApi {
  getAccountFee(token: String): Promise<GetAccountFee>
  getReferentialAccountId(token: String): Promise<GetReferentialAccountId>
}

export const accountFeeApiFactory = (
  backendApi: EosBackendApi,
): AccountFeeApi => {
  const getAccountFee = (token: string): Promise<GetAccountFee> =>
    backendApi.getAccountFee(token)
  const getReferentialAccountId = (token: string): Promise<GetReferentialAccountId> =>
    backendApi.getReferentialAccountId(token)
  return { getAccountFee, getReferentialAccountId }
}
