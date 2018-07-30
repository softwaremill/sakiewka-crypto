import { createMultisigRedeemScript, redeemScriptToAddress } from './bitcoin'

import { deriveKey } from './wallet'
import { BITCOIN_NETWORK } from './constants'

export const generateNewMultisigAddress = (
  rootKeys: String[], path: string, networkName: string = BITCOIN_NETWORK
) => {
  const derivedKeys = rootKeys.map((rootKey: string) => {
    return deriveKey(rootKey, path).neutered().toBase58()
  })

  const redeemScript = createMultisigRedeemScript(derivedKeys)
  const address = redeemScriptToAddress(redeemScript, networkName)

  return { address, redeemScript }
}
