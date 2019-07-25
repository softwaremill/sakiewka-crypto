import { KeyModule } from './bitcoin-key'
import { BitcoinBackendApi } from './bitcoin-backend-api'
import { BitcoinOperations } from './bitcoin-operations'
import {
  CreateNewAddressResponse,
  GetAddressResponse,
  ListAddressesResponse,
} from '../../types/response-types/address'
import { Address, AddressBitcoin } from '../../types/domain-types/address'

export interface AddressApi {
  createNewAddress(
    userToken: string,
    walletId: string,
    name?: string,
  ): Promise<CreateNewAddressResponse>

  getAddress(
    userToken: string,
    walletId: string,
    address: string,
  ): Promise<GetAddressResponse>

  listAddresses(
    userToken: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListAddressesResponse>
}

export const addressApiFactory = (
  backendApi: BitcoinBackendApi,
): AddressApi => {
  const castAddressBitcoinToAddress = ({
    address,
    id,
    name,
    created,
  }: AddressBitcoin): Address => ({ address, id, name, created } as Address)

  const createNewAddress = (
    userToken: string,
    walletId: string,
    name?: string,
  ) => backendApi.createNewAddress(userToken, walletId, false, name)

  const getAddress = async (
    userToken: string,
    walletId: string,
    address: string,
  ): Promise<GetAddressResponse> =>
    castAddressBitcoinToAddress(
      await backendApi.getAddress(userToken, walletId, address),
    )

  const listAddresses = async (
    userToken: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListAddressesResponse> => {
    const response = await backendApi.listAddresses(
      userToken,
      walletId,
      limit,
      nextPageToken,
    )
    return {
      ...response,
      addresses: response.addresses.map(castAddressBitcoinToAddress),
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
