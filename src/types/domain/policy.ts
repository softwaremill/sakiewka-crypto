export interface PolicySettings {
  kind: PolicyKind
}

export enum PolicyKind {
  MaxDailyAmount = 'maxDailyAmount',
  Whitelist = 'whitelist',
}

export class DailyAmountPolicy implements PolicySettings {
  kind: PolicyKind = PolicyKind.MaxDailyAmount
  amount: string

  constructor(amount: string) {
    this.amount = amount
  }
}

export class WhitelistPolicy implements PolicySettings {
  kind: PolicyKind = PolicyKind.Whitelist
  addresses: string[]

  constructor(addresss: string[]) {
    this.addresses = addresss
  }
}

export interface Policy {
  id: string
  created: string
  name: string
  settings: PolicySettings
}

export interface PolicyWalletData {
  id: string
  name: string
  currency: string
  created: string
}