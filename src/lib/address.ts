import { Currency } from "../types/domain";
import * as backendApiFactory from './backend-api'
import bitcoinFactory from './bitcoin'
import keyFactory from './key'

export default (backendApiUrl: string, currency: Currency, btcNetwork: string) => {
  const backendApi = backendApiFactory.withCurrency(backendApiUrl, currency)
  const bitcoin = bitcoinFactory(currency, btcNetwork)
  const keyApi = keyFactory(backendApiUrl, currency, btcNetwork)

  const generateNewMultisigAddress = (rootKeys: String[], path: string): any => {
    const derivedKeys = rootKeys.map((rootKey: string) => {
      return keyApi.deriveKey(rootKey, path).neutered().toBase58()
    })

    const redeemScript = bitcoin.createMultisigRedeemScript(derivedKeys)
    const address = bitcoin.redeemScriptToAddress(redeemScript)

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