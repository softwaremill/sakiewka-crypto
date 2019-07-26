export interface UserInfo {
  email: string
  token: string
  tokenInfo: TokenInfo
  twoFaEnabled: boolean
}

export interface TokenInfo {
  scope: string[]
  expiry: string
}
