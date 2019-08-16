import { PrivateKey } from 'eosjs-ecc'
import { encrypt, decrypt } from '../crypto'
import { KeyPair } from "../../types/domain";

export interface EosKeyModule {
  generateNewKeyPair(): Promise<KeyPair>
  generateNewKey(): Promise<PrivateKey>
  encryptKeyPair(keyPair: KeyPair, passphrase: string): KeyPair
  encryptKey(prvKey:PrivateKey, passphrase: string): string
  decryptKeyPair(keyPair: KeyPair, passphrase: string): KeyPair
  decryptKey(privateKey: string, passphrase: string): PrivateKey
  deriveKeyPair(keyPair: KeyPair, path: string): KeyPair
  deriveKey(rootKey: string, path: string): PrivateKey
}

export const eosKeyModuleFactory = (): EosKeyModule => {
  const generateNewKeyPair = async (): Promise<KeyPair> => {
    const prvKey = await generateNewKey()
    return { pubKey: prvKey.toPublic().toString(), prvKey: prvKey.toString() };
  }

  const generateNewKey = async (): Promise<PrivateKey> => {
    return PrivateKey.randomKey()
  }

  const encryptKeyPair = (keyPair: KeyPair, passphrase: string) => {
    const encryptedPrvKey = encryptKey(keyPair.prvKey!, passphrase)
    return { prvKey: encryptedPrvKey, pubKey: keyPair.pubKey }
  }

  const encryptKey = (privateKey: PrivateKey, passPhrase: string): string => {
    return encrypt(passPhrase, privateKey.toString())
  }

  const decryptKeyPair = (keyPair: KeyPair, passphrase: string) : KeyPair => {
    const decryptedPrvKey = decryptKey(keyPair.prvKey!, passphrase)
    return { prvKey: decryptedPrvKey.toString(), pubKey: decryptedPrvKey.toPublic().toString() }
  }

  const decryptKey = (privateKey: string, passphrase: string): PrivateKey => {
    return PrivateKey(decrypt(passphrase, privateKey))
  }

  const deriveKeyPair = (keyPair: KeyPair, path: string) : KeyPair => {
    const derivedPrvKey = deriveKey(keyPair.prvKey!, path)
    return { prvKey: derivedPrvKey.toString(), pubKey: derivedPrvKey.toPublic().toString() }
  }

  const deriveKey = (rootKey: string, path: string): PrivateKey => {
    const master = PrivateKey(rootKey)
    return master.getChildKey(path)
  }

  return {
    generateNewKeyPair,
    generateNewKey,
    encryptKeyPair,
    encryptKey,
    decryptKeyPair,
    decryptKey,
    deriveKeyPair,
    deriveKey
  }
}
