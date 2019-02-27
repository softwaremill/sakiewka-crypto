import { networks } from "bitcoinjs-lib";
import { SupportedNetworks } from '../types/domain'
import { ErrorDetails } from "response";

export const ROOT_DERIVATION_PATH = 'm/45\''

export const BASE_API_PATH = 'api'

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

export const SUPPORTED_NETWORKS: SupportedNetworks = {
  bitcoin: networks.bitcoin,
  testnet: networks.testnet,
  regtest: Object.assign({}, networks.testnet, { bech32: 'bcrt' }) //Introduced in in newer versions of bitcoinjs-lib - https://github.com/bitcoinjs/bitcoinjs-lib/blob/489e96ca917bfff11357800344f1510b9ca68ce8/src/networks.js#L16
}

export const Errors = {
  XprivOrPasswordHasToBeSpecified: <ErrorDetails>({ message: "Password or xprv has to be specified!", code: "SKC1" }),
  IncorrectPassphrase: <ErrorDetails>({ message: "Password or xprv has to be specified!", code: "SKC2" }),
  NoPrivateKeyOnServer: <ErrorDetails>({ message: "There is no private key on server!", code: "SKC3" })
} 