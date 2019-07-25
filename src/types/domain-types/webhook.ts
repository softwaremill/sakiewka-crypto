export enum WebhookType {
  TRANSFER = 'transfer',
}

export interface Webhook {
  id: string
  walletId: string
  callbackUrl: string
  settings: {
    type: WebhookType;
    confirmations: number;
  }
}
