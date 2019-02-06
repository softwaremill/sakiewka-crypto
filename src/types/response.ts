import { UTXO, Key, Path, KeyType } from './domain'

export interface LoginBackendResponse {
  token: string
}

export interface RegisterBackendResponse {}

export interface InfoBackendResponse {}

export interface MontlySummaryBackendResponse {
  spentBTC: string,
  spentFiat: string,
  serviceFeeBTC: string,
  serviceFeeFiat: string
}

export interface Init2faBackendResponse {
  qrCodeUrl: string
}

export interface Confirm2faBackendResponse {}

export interface Disable2faBackendResponse {}

export interface CreateWalletBackendParams {
  name: string,
  userPubKey: string,
  userPrvKey?: string,
  backupPubKey: string,
  backupPrvKey?: string
}

export interface GetUtxosBackendParams {
  feeRate: string,
  recipients: ReceipientsBackend[]
}

export interface ReceipientsBackend {
  address: string,
  amount : string
}

interface WalletBackendResponse {
  id: string,
  keys: Key[]
}

export interface CreateWalletBackendResponse extends WalletBackendResponse {
  servicePubKey: string,
  initialAddress: {
    address: string,
    path: Path
  }
}

export interface GetWalletBackendResponse extends WalletBackendResponse {
  name: string,
  currency: string,
  created: string
}

export interface CreateNewAddressBackendResponse {
  address: string,
  path: {
    cosignerIndex: string,
    change: string,
    addressIndex: string
  }
}

export interface GetAddressBackendResponse {
  address: string,
  path: {
    cosignerIndex: string,
    change: string,
    addressIndex: string
  },
  name: string,
  created: string
}

export interface ListAddressesBackendResponse {}

export interface ListWalletsBackendResponse {}

export interface GetWalletBalanceBackendResponse {}

export interface ListUnspentsBackendResponse {
  outputs: UTXO[],
  amount: string,
  change: string,
  fee: string,
  serviceFee?: ServiceFee
}

export interface ServiceFee {
  amount: string,
  address: string
}

export interface GetKeyBackendResponse {
  id: string
  pubKey: string
  prvKey? : string
  keyType: KeyType
  created: string
}

// eth
export interface EthGetTransactionParamsResponse {
  contractNonce: string,
  currentBlock: string
}

export interface SendETHResponse {
  tx: string
}

export interface SendTokensResponse {
  tx: string
}

export interface GetFeesRates {
  recommended: string
}

export interface ErrorResponse {
  message: String,
  code: number
}

export interface MaxTransferAmountParams {
  recipient: string,
  feeRate: string
}

export interface MaxTransferAmountResponse {
  amount: string
}