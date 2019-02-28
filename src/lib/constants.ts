import { networks } from "bitcoinjs-lib";
import { SupportedNetworks } from '../types/domain'

export const ROOT_DERIVATION_PATH = 'm/45\''

export const BASE_API_PATH = 'api'

export const API_ERROR = {
  NOT_FOUND: {
    errors: [{ message: 'Not found' }],
    code: 404
  },
  SERVER_ERROR: {
    errors: [{ message: 'Server error' }],
    code: 500
  },
  BAD_REQUEST: {
    errors: [{ message: 'Malformed request' }],
    code: 400
  },
  XPRIV_OR_PASSWORD_REQUIRED:{
    errors: [{message: 'Password or xprv has to be specified!', code: 'SKC1'}],
    code: 400
  },
  INCORRECT_PASSPHRASE:{
    errors: [{message: 'Incorrect passphrase', code: 'SKC2'}],
    code: 400
  },
  NO_PRIV_KEY_ON_SERVER: {
    errors :[{message : 'There is no private key on server!', code: 'SKC3'}],
    code: 400
  }
}

export const SUPPORTED_NETWORKS: SupportedNetworks = {
  bitcoin: networks.bitcoin,
  testnet: networks.testnet,
  regtest: Object.assign({}, networks.testnet, { bech32: 'bcrt' }) //Introduced in in newer versions of bitcoinjs-lib - https://github.com/bitcoinjs/bitcoinjs-lib/blob/489e96ca917bfff11357800344f1510b9ca68ce8/src/networks.js#L16
}
