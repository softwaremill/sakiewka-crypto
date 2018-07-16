import bitcoinjsLib from 'bitcoinjs-lib'

import * as api from './backend-api'
import { getRandomBytes, encrypt } from './crypto'
import { Keychain, WalletParams } from './domain'

export const createKeychain = (label: string): Keychain => {
  const seed = getRandomBytes(512 / 8)
  const extendedKey = bitcoinjsLib.HDNode.fromSeedBuffer(seed)
  const xpub = extendedKey.neutered().toBase58()

  return {
    label,
    xpub,
    xprv: extendedKey.toBase58()
  }
}

export const createWallet = (params: WalletParams) => {
  const userKeychain = createKeychain('user')
  const backupKeychain = createKeychain('backup')

  const encryptedKeychains = [
    userKeychain,
    backupKeychain
  ].map((keychain: Keychain) => {
    return {
      ...keychain,
      xprv: encrypt(params.password, keychain.xprv)
    }
  })

  return api.createWallet(encryptedKeychains)
}
