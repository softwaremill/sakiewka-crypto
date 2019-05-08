import { UTXO, Key, Path, KeyType, Policy, PolicySettings } from './domain'

export interface LoginBackendResponse {
  token: string
}

export interface RegisterBackendResponse {
}

export interface SetupPasswordBackendResponse {
}

export interface InfoBackendResponse {
}

export interface MontlySummaryBackendResponse {
  spentBTC: string,
  spentFiat: string,
  serviceFeeBTC: string,
  serviceFeeFiat: string
}

export interface ListTransfersBackendResponse {
  transfers: TransferItemBackendResponse[],
  nextPageToken?: string
}

export interface TransferItemBackendResponse {
  chain: string,
  wallet: TransferItemWallet
  timestamp: string,
  transaction: TransferItemTransaction,
  block?: TransferItemBlock
}

export interface TransferItemWallet { }

export interface TransferItemBlock { }

export interface TransferItemTransaction { }

export interface Init2faBackendResponse {
  qrCodeUrl: string
}

export interface Confirm2faBackendResponse {
}

export interface Disable2faBackendResponse {
}

export interface CreateWalletBackendParams {
  name: string,
  userPubKey: string,
  userPrvKey?: string,
  backupPubKey: string,
  backupPrvKey?: string
}

export interface GetUtxosBackendParams {
  feeRate: number,
  recipients: ReceipientsBackend[]
}

export interface ReceipientsBackend {
  address: string,
  amount: string
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
  created: string,
  balance: {
    available: string,
    locked: string
  }
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

export interface ListAddressesBackendResponse { }

export interface ListWalletsBackendResponse {
  wallets: GetWalletBackendResponse[],
  nextPageToken?: string
}

export interface GetWebhooksResponse {
  id: string,
  walletId: string,
  callbackUrl: string,
  settings: any
}

export interface ListWebhooksResponse {
  webhooks: GetWebhooksResponse[]
}

export interface DeleteWebhookResponse { }

export interface CreateWebhookResponse {
  id: string
}

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
  prvKey?: string
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
  recommended: number
}

export interface ErrorResponse {
  errors: ErrorDetails[],
  code: number
}

export interface ErrorDetails {
  message: string,
  code: string
}

export interface MaxTransferAmountParams {
  recipient: string,
  feeRate: string
}

export interface MaxTransferAmountResponse {
  amount: string
}

export interface ChainInfoResponse {
  type: string
}

export interface ListPoliciesForWalletResponse {
  policies: Policy[]
}

export interface PolicyCreateRequest {
  name: string,
  settings: PolicySettings
}

export interface PolicyCreatedResponse {
  policy: Policy
}

export interface ListPoliciesResponse {
  policies: Policy[]
  nextPageToken?: string,
}

export interface AssignPolicyBackendParams {
  walletId: string
}

export interface ListWalletsForPolicyResponse { }