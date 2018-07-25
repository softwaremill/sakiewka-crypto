import bitcoinjsLib from 'bitcoinjs-lib'

import * as constants from './constants'
import { Wallet, Address } from '../types/domain'

export const generateNewMultisigAddress = (
  rootKeys: String[], path: string, change: boolean = false
): string => {
  const derivedKeysBuffers = rootKeys.map((rootKey: string) => {
    const derivedKey = deriveKey(rootKey, path, change)
    return derivedKey.getPublicKeyBuffer()
  })

  const redeemScript = bitcoinjsLib.script.multisig.output.encode(2, derivedKeysBuffers)
  const scriptPubKey = bitcoinjsLib.script.scriptHash.output.encode(
    bitcoinjsLib.crypto.hash160(redeemScript)
  )
  const address = bitcoinjsLib.address.fromOutputScript(scriptPubKey)

  return address
}

export const deriveKey = (rootKey: string, path: string, change: boolean = false) => {
  const node = bitcoinjsLib.HDNode.fromBase58(rootKey)
  return node.derivePath(`${constants.ROOT_PATH}/${change ? 1 : 0}/${path}`)
}

export const getNextAddressIndex = (wallet: Wallet, change: boolean = false): number => {
  return wallet.addresses[change ? 'change' : 'receive'].length
}

export const addNewAddress = (
  wallet: Wallet, newAddress: Address, change: boolean = false
): Wallet  => {
  const addressType = change ? 'change' : 'receive'

  return {
    ...wallet,
    addresses:  {
      ...wallet.addresses,
      [addressType]: [
        ...wallet.addresses[addressType],
        newAddress
      ]
    }
  }
}
