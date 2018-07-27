export const ROOT_DERIVATION_PATH = 'm/45'
export const USER_KEYCHAIN_LABEL = 'user'
export const BACKUP_KEYCHAIN_LABEL = 'user'

export const BASE_API_PATH = 'api'
export const BACKEND_API_PREFIX = 'api/v1'

export const BITCOIN_NETWORK = 'bitcoin'
export const TESTNET_NETWORK = 'testnet'

export const BTC_RECOMMENDED_FEE_URL = 'https://bitcoinfees.earn.com/api/v1/fees/recommended'

export const API_ERROR = {
  NOT_FOUND: {
    message: 'Not found',
    code: 404
  },
  SERVER_ERROR: {
    message: 'Server error',
    code: 500
  },
  BAD_REQUEST: {
    message: 'Malformed request',
    code: 400
  }
}
