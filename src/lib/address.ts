import { createMultisigRedeemScript, redeemScriptToAddress } from './bitcoin'
import { createNewAddress as createNewAddressBackend } from './backend-api'
import { deriveKey } from './key'
import { BITCOIN_NETWORK } from './constants'

export const generateNewMultisigAddress = (
  rootKeys: String[], path: string, networkName: string = BITCOIN_NETWORK
): any => {
  const derivedKeys = rootKeys.map((rootKey: string) => {
    return deriveKey(rootKey, path).neutered().toBase58()
  })

  const redeemScript = createMultisigRedeemScript(derivedKeys)
  const address = redeemScriptToAddress(redeemScript, networkName)

  return { address, redeemScript }
}

export const createNewAddress = (
  userToken: string,
  walletId: string,
  name?: string
) => {
  return createNewAddressBackend(userToken, walletId, name)
}
