import { KeyPair } from '../../types/domain'
import { getRandomBytes, encrypt, decrypt } from '../crypto'
import { HDNode } from 'bitcoinjs-lib'
import { BitcoinBackendApi } from './bitcoin-backend-api';
import { BitcoinOperations } from './bitcoin-operations';
import { GetKeyBackendResponse } from '../../types/response';

export interface KeyModule {
  generateNewKeyPair(path?: string): KeyPair
  encryptKeyPair(keyPair: KeyPair, passphrase: string): KeyPair
  decryptKeyPair(keyPair: KeyPair, passphrase: string) : KeyPair
  deriveKeyPair(keyPair: KeyPair, path: string): KeyPair
  deriveKey(rootKey: string, path: string): HDNode
}

export interface KeyApi {
  getKey(userToken: string, keyId: string, includePrivate?: boolean): Promise<GetKeyBackendResponse>
}

export const keyModuleFactory = (bitcoin: BitcoinOperations): KeyModule => {
  const generateNewKeyPair = (
    path?: string
  ): KeyPair => {
    const seed = getRandomBytes(512 / 8)
    const rootExtendedKey = bitcoin.seedBufferToHDNode(seed)
    const extendedKey = path ? rootExtendedKey.derivePath(path) : rootExtendedKey
    const pubKey = extendedKey.neutered().toBase58()

    return {
      pubKey,
      prvKey: rootExtendedKey.toBase58()
    }
  }

  const encryptKeyPair = (keyPair: KeyPair, passphrase: string): KeyPair => {
    if (keyPair.prvKey) {
      return {
        ...keyPair,
        prvKey: encrypt(passphrase, keyPair.prvKey)
      }
    }

    return { ...keyPair }
  }

  const decryptKeyPair = (keyPair: KeyPair, passphrase: string): KeyPair => { 
    if (keyPair.prvKey) {
      return {
        ...keyPair,
        prvKey: decrypt(passphrase, keyPair.prvKey)
      }
    }

    return { ...keyPair }
  }

  const deriveKeyPair = (
    keyPair: KeyPair, path: string
  ): KeyPair => {
    const rootExtendedKey = bitcoin.base58ToHDNode(keyPair.prvKey!)
    const derivedExtendedKey = rootExtendedKey.derivePath(path)
    const pubKey = bitcoin.hdNodeToBase58Pub(derivedExtendedKey)
    const prvKey = bitcoin.hdNodeToBase58Prv(derivedExtendedKey)

    return { pubKey, prvKey }
  }

  const deriveKey = (
    rootKey: string, path: string
  ): HDNode => {
    const node = bitcoin.base58ToHDNode(rootKey)

    if (path === '') return node
    return node.derivePath(path)
  }
  return { generateNewKeyPair, encryptKeyPair, deriveKeyPair, deriveKey, decryptKeyPair }
}

export const keyApiFactory = (backendApi: BitcoinBackendApi): KeyApi => {
  const getKey = (
    userToken: string,
    keyId: string,
    includePrivate?: boolean
  ): Promise<GetKeyBackendResponse> => backendApi.getKey(userToken, keyId, includePrivate)
  return { getKey }
}