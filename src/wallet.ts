import bitcoinjsLib from 'bitcoinjs-lib'
import { getRandomBytes, encrypt } from './crypto'

interface WalletParams {
  password: string
}

export const createKeychain = () => {
  const seed = getRandomBytes(512 / 8)
  const extendedKey = bitcoinjsLib.HDNode.fromSeedBuffer(seed)
  const xpub = extendedKey.neutered().toBase58()

  return {
    xpub,
    xprv: extendedKey.toBase58()
  }
}

export const createWallet = (params: WalletParams) => {
  const userKeychain = createKeychain()
  const backupKeychain = createKeychain()

  console.log('xprv: ', userKeychain.xprv)

  const encryptedUserXprv = encrypt(params.password, userKeychain.xprv)
  const encryptedBackupXprv = encrypt(params.password, backupKeychain.xprv)

  // if (params.xpub) {}

  // send to backend
  return {

  }
}
