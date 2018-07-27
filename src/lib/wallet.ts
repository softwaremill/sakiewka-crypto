import bitcoinjsLib from 'bitcoinjs-lib'

import { getRandomBytes, encrypt } from './crypto'
import { Keypair, WalletParams } from '../types/domain'
import { BITCOIN_NETWORK } from './constants'

export const generateNewKeypair = (networkName: string = BITCOIN_NETWORK): Keypair => {
  const network = bitcoinjsLib.networks[networkName]

  const seed = getRandomBytes(512 / 8)
  const extendedKey = bitcoinjsLib.HDNode.fromSeedBuffer(seed, network)
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
    generateNewKeypair()

  const backupKeychain = params.backupPubKey ?
    { pubKey: params.backupPubKey } :
    generateNewKeypair()

  return {
    user: encryptKeyPair(userKeychain, params.passphrase),
    backup: encryptKeyPair(backupKeychain, params.passphrase)
  }
}

export const deriveKey = (rootKey: string, path: string) => {
  const node = bitcoinjsLib.HDNode.fromBase58(rootKey)
  return node.derivePath(path)
}
