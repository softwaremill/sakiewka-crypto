import bitcoinjsLib from 'bitcoinjs-lib'

import { deriveKey } from './wallet'

export const generateNewMultisigAddress = (
  rootKeys: String[], path: string
): string => {
  const derivedKeysBuffers = rootKeys.map((rootKey: string) => {
    const derivedKey = deriveKey(rootKey, path)
    return derivedKey.getPublicKeyBuffer()
  })

  const redeemScript = bitcoinjsLib.script.multisig.output.encode(2, derivedKeysBuffers)
  const scriptPubKey = bitcoinjsLib.script.scriptHash.output.encode(
    bitcoinjsLib.crypto.hash160(redeemScript)
  )
  const address = bitcoinjsLib.address.fromOutputScript(scriptPubKey)

  return address
}
