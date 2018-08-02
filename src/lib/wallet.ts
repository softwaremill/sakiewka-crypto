import { getRandomBytes, encrypt } from './crypto'
import { KeyPair, WalletParams } from '../types/domain'
import { BITCOIN_NETWORK, ROOT_DERIVATION_PATH } from './constants'
import { filterObject } from './utils/helpers'
import { createWallet as createWalletBackend } from './backend-api'
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

export const createWallet = async (userToken: string, params: WalletParams): Promise<any> => {
  const userKeychain = params.userPubKey ?
    { pubKey: params.userPubKey } :
    deriveKeyPair(generateNewKeyPair(), ROOT_DERIVATION_PATH)

  const backupKeychain = params.backupPubKey ?
    { pubKey: params.backupPubKey } :
    deriveKeyPair(generateNewKeyPair(), ROOT_DERIVATION_PATH)

  const encryptedUserKeychain = encryptKeyPair(userKeychain, params.passphrase)
  const encryptedBackupKeychain = encryptKeyPair(backupKeychain, params.passphrase)

  const backendRequestParams = filterObject(
    {
      label: params.label,
      userPubKey: encryptedUserKeychain.pubKey,
      userPrvKey: encryptedUserKeychain.prvKey,
      backupPubKey: encryptedBackupKeychain.pubKey,
      backupPrvKey: encryptedBackupKeychain.prvKey
    },
    (value: any) => value
  )

  const backendResponse = await createWalletBackend(userToken, backendRequestParams)

  return {
    walletId: backendResponse.id,
    user: userKeychain,
    backup: backupKeychain
  }
}
