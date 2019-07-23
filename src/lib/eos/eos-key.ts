import { PrivateKey } from 'eosjs-ecc'
import { encrypt, decrypt } from '../crypto'

export interface KeyModule {
  generateNewKey(): Promise<PrivateKey>
  encryptKey(privateKey: PrivateKey, passphrase: string): string
  decryptKey(privateKey: string, passphrase: string): PrivateKey
  deriveKey(rootKey: string, path: string): PrivateKey
}

export const keyModuleFactory = (): KeyModule => {
  const generateNewKey = async (): Promise<PrivateKey> => {
    return PrivateKey.randomKey()
  }

  const encryptKey = (privateKey: PrivateKey, passPhrase: string): string => {
    return encrypt(passPhrase, privateKey.toString())
  }

  const decryptKey = (privateKey: string, passphrase: string): PrivateKey => {
    return PrivateKey(decrypt(passphrase, privateKey))
  }

  const deriveKey = (root: string, path: string): PrivateKey => {
    const master = PrivateKey(root)
    return master.getChildKey(path)
  }

  return {
    generateNewKey,
    encryptKey,
    decryptKey,
    deriveKey,
  }
}
