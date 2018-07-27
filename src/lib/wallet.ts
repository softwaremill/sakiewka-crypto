import bitcoinjsLib from 'bitcoinjs-lib'

import { getRandomBytes, encrypt } from './crypto'
import { Keypair, WalletParams } from '../types/domain'
import { BITCOIN_NETWORK, ROOT_DERIVATION_PATH } from './constants'

export const generateNewKeypair = (path?: string, networkName: string = BITCOIN_NETWORK): Keypair => {
  const network = bitcoinjsLib.networks[networkName]

  const seed = getRandomBytes(512 / 8)
  const rootExtendedKey = bitcoinjsLib.HDNode.fromSeedBuffer(seed, network)
  const extendedKey = path ? rootExtendedKey.derivePath(path) : rootExtendedKey
  const pubKey = extendedKey.neutered().toBase58()

  return {
    pubKey,
    privKey: extendedKey.toBase58()
  }
}

export const encryptKeyPair = (keypair: Keypair, passphrase: string): Keypair => {
  if (keypair.privKey) {
    return {
      ...keypair,
      privKey: encrypt(passphrase, keypair.privKey)
    }
  }

  return { ...keypair }
}

export const prepareKeypairs = (params: WalletParams) => {
  const userKeychain = params.userPubKey ?
    { pubKey: params.userPubKey } :
    generateNewKeypair(`${ROOT_DERIVATION_PATH}/0`)

  const backupKeychain = params.backupPubKey ?
    { pubKey: params.backupPubKey } :
    generateNewKeypair(`${ROOT_DERIVATION_PATH}/1`)

  return {
    user: encryptKeyPair(userKeychain, params.passphrase),
    backup: encryptKeyPair(backupKeychain, params.passphrase)
  }
}

export const deriveKey = (rootKey: string, path: string) => {
  const node = bitcoinjsLib.HDNode.fromBase58(rootKey)
  return node.derivePath(path)
}
