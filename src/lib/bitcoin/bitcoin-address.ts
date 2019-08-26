import { KeyModule } from './bitcoin-key'
import { BitcoinBackendApi } from './bitcoin-backend-api'
import { BitcoinOperations } from './bitcoin-operations'
import {
  CreateNewBitcoinAddressResponse,
  GetBitcoinAddressResponse,
  ListBitcoinAddressesResponse,
} from '../../types/response/address'

export interface BitcoinAddressApi {
  createNewAddress(
    userToken: string,
    walletId: string,
    name?: string,
  ): Promise<CreateNewBitcoinAddressResponse>

  getAddress(
    userToken: string,
    walletId: string,
    address: string,
  ): Promise<GetBitcoinAddressResponse>

  listAddresses(
    userToken: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListBitcoinAddressesResponse>
}

export const bitcoinAddressApiFactory = (
  backendApi: BitcoinBackendApi,
): BitcoinAddressApi => {
  const createNewAddress = (
    userToken: string,
    walletId: string,
    name?: string,
  ) => backendApi.createNewAddress(userToken, walletId, false, name)

  const getAddress = async (
    userToken: string,
    walletId: string,
    address: string,
  ): Promise<GetBitcoinAddressResponse> =>
    await backendApi.getAddress(userToken, walletId, address)

  const listAddresses = async (
    userToken: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListBitcoinAddressesResponse> => {
    const response = await backendApi.listAddresses(
      userToken,
      walletId,
      limit,
      nextPageToken,
    )
    return {
      ...response,
      addresses: response.addresses,
    }
  }

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
