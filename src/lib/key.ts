import { Currency, KeyPair } from '../types/domain'
import { getRandomBytes, encrypt } from './crypto'
import { HDNode } from 'bitcoinjs-lib'
import bitcoinFactory from './bitcoin'
import * as backendApiFactory from './backend-api'


export default (backendApiUrl:string, currency: Currency, btcNetwork: string) => {
  const backendApi = backendApiFactory.withCurrency(backendApiUrl, currency)
  const bitcoin = bitcoinFactory(currency, btcNetwork)

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

  const getKey = (
    userToken: string,
    keyId: string,
    includePrivate?: boolean
  ) => backendApi.getKey(userToken, keyId, includePrivate)

  return { generateNewKeyPair, encryptKeyPair, deriveKeyPair, deriveKey, getKey }

}