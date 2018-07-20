import bitcoinjsLib from 'bitcoinjs-lib'

import * as api from './backend-api'
import { getRandomBytes, encrypt, decrypt } from './crypto'
import { Keypair, WalletParams, DetailedWallet } from '../types/domain'
import { USER_KEYCHAIN_LABEL, BACKUP_KEYCHAIN_LABEL } from './constants'

export const generateNewKeypair = (): Keypair => {
  const seed = getRandomBytes(512 / 8)
  const extendedKey = bitcoinjsLib.HDNode.fromSeedBuffer(seed)
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

export const getUserXprv = (wallet: DetailedWallet, walletPassphrase: string) => {
  const encryptedXprv = wallet
    .keychains
    .find((k: Keypair) => k.label === USER_KEYCHAIN_LABEL)
    .encryptedXprv

  return decrypt(walletPassphrase, encryptedXprv)
}
