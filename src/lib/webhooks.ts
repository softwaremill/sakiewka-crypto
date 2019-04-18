import { CurrencyBackendApi } from './backend-api'

import { CreateWebhookResponse, DeleteWebhookResponse, GetWebhooksResponse, ListWebhooksResponse } from '../types/response'
import { WebhookType } from './constants';

export interface WebhooksApi {
  createWebhook(token: string, walletId: string, callbackUrl: string, type: WebhookType, settings: Object): Promise<CreateWebhookResponse>
  listWebhooks(token: string, walletId: string, limit: number, nextPageToken?: string): Promise<ListWebhooksResponse>
  getWebhook(token: string, walletId: string, webhookId: string): Promise<GetWebhooksResponse>
  deleteWebhook(token: string, walletId: string, webhookId: string): Promise<DeleteWebhookResponse>
}
export const webhooksApiFactory = (backend: CurrencyBackendApi): WebhooksApi => {
  const getWebhook = (userToken: string, walletId: string, webhookId: string) =>
    backend.getWebhook(userToken, walletId, webhookId)

  const listWebhooks = (userToken: string, walletId: string, limit: number, nextPageToken?: string) =>
    backend.listWebhooks(userToken, walletId, limit, nextPageToken)

  const createWebhook = (userToken: string, walletId: string, callbackUrl: string, type: WebhookType, settings: Object) =>
    backend.createWebhook(userToken, walletId, callbackUrl, type, settings)

  const deleteWebhook = (userToken: string, walletId: string, webhookId: string) =>
    backend.deleteWebhook(userToken, walletId, webhookId)

  return {
    getWebhook,
    listWebhooks,
    createWebhook,
    deleteWebhook
  }
}
