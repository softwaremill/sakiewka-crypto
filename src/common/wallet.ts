import bitcoinjsLib from 'bitcoinjs-lib'

import * as api from './backend-api'
import { getRandomBytes, encrypt, decrypt } from './crypto'
import { Keychain, WalletParams, DetailedWallet } from './domain'
import { USER_KEYCHAIN_LABEL, BACKUP_KEYCHAIN_LABEL } from './constants'

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
  const userKeychain = createKeychain(USER_KEYCHAIN_LABEL)
  const backupKeychain = createKeychain(BACKUP_KEYCHAIN_LABEL)

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

export const getUserXprv = (wallet: DetailedWallet, walletPassphrase: string) => {
  const encryptedXprv = wallet
    .keychains
    .find((k: Keychain) => k.label === USER_KEYCHAIN_LABEL)
    .encryptedXprv

  return decrypt(walletPassphrase, encryptedXprv)
}
