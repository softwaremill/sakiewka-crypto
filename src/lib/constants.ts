import { networks } from 'bgoldjs-lib'
import { Currency, SupportedNetworks } from '../types/domain/currency'

export const ROOT_DERIVATION_PATH = "m/45'"

export const BASE_API_PATH = 'api/v1.0'

export const INTERNAL_ERROR_CODE = 'SKC3'

export const API_ERROR = {
  NOT_FOUND: {
    errors: [{ message: 'Not found', code: 'SKC1' }],
    code: 404,
  },
  SERVER_ERROR: {
    errors: [{ message: 'Server error', code: 'SKC2' }],
    code: 500,
  },
  BAD_REQUEST: {
    errors: [{ message: 'Malformed request', code: INTERNAL_ERROR_CODE }],
    code: 400,
  },
  XPRIV_OR_PASSWORD_REQUIRED: {
    errors: [
      { message: 'Password or xprv has to be specified!', code: 'SKC4' },
    ],
    code: 400,
  },
  INCORRECT_PASSPHRASE: {
    errors: [{ message: 'Incorrect passphrase', code: 'SKC5' }],
    code: 400,
  },
  NO_PRIV_KEY_ON_SERVER: {
    errors: [{ message: 'There is no private key on server!', code: 'SKC6' }],
    code: 400,
  },
  PASSWORD_TOO_SHORT: (minLength: number) => ({
    errors: [
      {
        message: `Password must be longer than ${minLength - 1}!`,
        code: 'SKC7',
      },
    ],
    code: 400,
  }),
  PASSPHRASE_TOO_SHORT: (minLength: number) => ({
    errors: [
      {
        message: `Passphrase must be longer than ${minLength - 1}!`,
        code: 'SKC8',
      },
    ],
    code: 400,
  }),
}

export const SUPPORTED_NETWORKS: SupportedNetworks = {
  [Currency.BTC]: {
    mainnet: networks.bitcoin,
    testnet: networks.testnet,
    regtest: Object.assign({}, networks.testnet, { bech32: 'bcrt' }), // Introduced in in newer versions of bitcoinjs-lib - https://github.com/bitcoinjs/bitcoinjs-lib/blob/489e96ca917bfff11357800344f1510b9ca68ce8/src/networks.js#L16,
  },
  [Currency.BTG]: {
    mainnet: networks.bitcoingold,
    testnet: networks.bitcoingoldtestnet,
    regtest: networks.bitcoingoldregtest,
  },
}
