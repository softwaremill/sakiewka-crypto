import { BITCOIN_NETWORK } from './constants'
import { KeyPair } from '../types/domain'
import { getRandomBytes, encrypt } from './crypto'
import { base58ToHDNode, seedBufferToHDNode, hdNodeToBase58Pub, hdNodeToBase58Prv } from './bitcoin'
import { HDNode } from 'bitcoinjs-lib'

export const generateNewKeyPair = (
  path?: string, networkName: string = BITCOIN_NETWORK
): KeyPair => {
  const seed = getRandomBytes(512 / 8)
  const rootExtendedKey = seedBufferToHDNode(seed, networkName)
  const extendedKey = path ? rootExtendedKey.derivePath(path) : rootExtendedKey
  const pubKey = extendedKey.neutered().toBase58()

  return {
    pubKey,
    prvKey: rootExtendedKey.toBase58()
  }
}

export const encryptKeyPair = (keyPair: KeyPair, passphrase: string): KeyPair => {
  if (keyPair.prvKey) {
    return {
      ...keyPair,
      prvKey: encrypt(passphrase, keyPair.prvKey)
    }
  }

  return { ...keyPair }
}

export const deriveKeyPair = (
  keyPair: KeyPair, path: string, onlyPub: boolean = true
): KeyPair => {
  const rootExtendedKey = base58ToHDNode(keyPair.prvKey)
  const derivedExtendedKey = rootExtendedKey.derivePath(path)
  const pubKey = hdNodeToBase58Pub(derivedExtendedKey)
  const prvKey = onlyPub ?
    hdNodeToBase58Prv(rootExtendedKey) : hdNodeToBase58Prv(derivedExtendedKey)

  return { pubKey, prvKey }
}

export const deriveKey = (
  rootKey: string, path: string, networkName: string = BITCOIN_NETWORK
): HDNode => {
  const node = base58ToHDNode(rootKey, networkName)

  if (path === '') return node
  return node.derivePath(path)
}
