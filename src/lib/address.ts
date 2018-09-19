import { createMultisigRedeemScript, redeemScriptToAddress } from './bitcoin'
import {
  createNewAddress as createNewAddressBackend,
  getAddress as getAddressBackend,
  listAddresses as listAddressesBackend
} from './backend-api'
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
) => createNewAddressBackend(userToken, walletId, name)

export const getAddress = (
  userToken: string,
  walletId: string,
  address: string
) => getAddressBackend(userToken, walletId, address)

export const listAddresses = (
  userToken: string,
  walletId: string,
  limit: number,
  nextPageToken?: string
) => listAddressesBackend(userToken, walletId, limit, nextPageToken)
