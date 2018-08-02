import { WalletParams } from '../types/domain'
import { ROOT_DERIVATION_PATH } from './constants'
import { filterObject } from './utils/helpers'
import { createWallet as createWalletBackend } from './backend-api'
import { deriveKeyPair, generateNewKeyPair, encryptKeyPair } from './key'

export const createWallet = async (userToken: string, params: WalletParams): Promise<any> => {
  const userKeyPair = params.userPubKey ?
    { pubKey: params.userPubKey } :
    deriveKeyPair(generateNewKeyPair(), ROOT_DERIVATION_PATH)

  const backupKeyPair = params.backupPubKey ?
    { pubKey: params.backupPubKey } :
    deriveKeyPair(generateNewKeyPair(), ROOT_DERIVATION_PATH)

  const encryptedUserKeyPair = encryptKeyPair(userKeyPair, params.passphrase)
  const encryptedBackupKeyPair = encryptKeyPair(backupKeyPair, params.passphrase)

  const backendRequestParams = filterObject(
    {
      label: params.label,
      userPubKey: encryptedUserKeyPair.pubKey,
      userPrvKey: encryptedUserKeyPair.prvKey,
      backupPubKey: encryptedBackupKeyPair.pubKey,
      backupPrvKey: encryptedBackupKeyPair.prvKey
    },
    (value: any) => value
  )

  const backendResponse = await createWalletBackend(userToken, backendRequestParams)

  return {
    walletId: backendResponse.id,
    user: userKeyPair,
    backup: backupKeyPair
  }
}
