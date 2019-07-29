export enum WebhookType {
  TRANSFER = 'transfer',
}

export interface WebhhokSettings {
  type: WebhookType;
  confirmations: number;
}

export interface Webhook {
  id: string
  walletId: string
  callbackUrl: string
  settings: WebhhokSettings
}
