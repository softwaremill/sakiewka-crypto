import { KeyModule } from './key'
import { CurrencyBackendApi } from "./backend-api";
import { BitcoinOperations } from "./bitcoin-operations";

export default (backendApi: CurrencyBackendApi, bitcoinOps: BitcoinOperations, keyModule: KeyModule) => {

  const generateNewMultisigAddress = (rootKeys: String[], path: string): any => {
    const derivedKeys = rootKeys.map((rootKey: string) => {
      return keyModule.deriveKey(rootKey, path).neutered().toBase58()
    })

    const redeemScript = bitcoinOps.createMultisigRedeemScript(derivedKeys)
    const address = bitcoinOps.redeemScriptToAddress(redeemScript)

    return { address, redeemScript }
  }

  const createNewAddress = (
    userToken: string,
    walletId: string,
    name?: string
  ) => backendApi.createNewAddress(userToken, walletId, false, name)

  const getAddress = (
    userToken: string,
    walletId: string,
    address: string
  ) => backendApi.getAddress(userToken, walletId, address)

  const listAddresses = (
    userToken: string,
    walletId: string,
    limit: number,
    nextPageToken?: string
  ) => backendApi.listAddresses(userToken, walletId, limit, nextPageToken)

  return { generateNewMultisigAddress, createNewAddress, getAddress, listAddresses }
}