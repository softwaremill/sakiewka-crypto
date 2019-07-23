import { KeyModule } from './bitcoin-key'
import { BitcoinBackendApi } from './bitcoin-backend-api'
import { BitcoinOperations } from './bitcoin-operations'
import {
  CreateNewBitcoinAddressBackendResponse,
  GetBitcoinAddressBackendResponse,
  ListAddressesBackendResponse,
} from '../../types/response'

export interface AddressApi {
  createNewAddress(
    userToken: string,
    walletId: string,
    name?: string,
  ): Promise<CreateNewBitcoinAddressBackendResponse>

  getAddress(
    userToken: string,
    walletId: string,
    address: string,
  ): Promise<GetBitcoinAddressBackendResponse>

  listAddresses(
    userToken: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListAddressesBackendResponse>
}

export const addressApiFactory = (
  backendApi: BitcoinBackendApi,
): AddressApi => {
  const createNewAddress = (
    userToken: string,
    walletId: string,
    name?: string,
  ) => backendApi.createNewAddress(userToken, walletId, false, name)

  const getAddress = (userToken: string, walletId: string, address: string) =>
    backendApi.getAddress(userToken, walletId, address)

  const listAddresses = (
    userToken: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ) => backendApi.listAddresses(userToken, walletId, limit, nextPageToken)
  return { createNewAddress, getAddress, listAddresses }
}

export interface AddressModule {
  generateNewMultisigAddress(
    rootKeys: String[],
    path: string,
  ): { address: string; redeemScript: Buffer }
}

export const addressModuleFactory = (
  bitcoinOps: BitcoinOperations,
  keyModule: KeyModule,
): AddressModule => {
  const generateNewMultisigAddress = (
    rootKeys: String[],
    path: string,
  ): { address: string; redeemScript: Buffer } => {
    const derivedKeys = rootKeys.map((rootKey: string) => {
      return keyModule
        .deriveKey(rootKey, path)
        .neutered()
        .toBase58()
    })

    const redeemScript = bitcoinOps.createMultisigRedeemScript(derivedKeys)
    const address = bitcoinOps.redeemScriptToAddress(redeemScript)

    return { address, redeemScript }
  }
  return { generateNewMultisigAddress }
}
