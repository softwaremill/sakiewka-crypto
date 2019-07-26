import { BitcoinBackendApi } from './bitcoin/bitcoin-backend-api'

import {
  CreateWebhookResponse,
  DeleteWebhookResponse,
  GetWebhookResponse,
  ListWebhooksResponse,
} from '../types/response/webhook'

export interface WebhooksApi {
  createWebhook(
    token: string,
    walletId: string,
    callbackUrl: string,
    settings: Object,
  ): Promise<CreateWebhookResponse>
  listWebhooks(
    token: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListWebhooksResponse>
  getWebhook(
    token: string,
    walletId: string,
    webhookId: string,
  ): Promise<GetWebhookResponse>
  deleteWebhook(
    token: string,
    walletId: string,
    webhookId: string,
  ): Promise<DeleteWebhookResponse>
}
export const webhooksApiFactory = (backend: BitcoinBackendApi): WebhooksApi => {
  const getWebhook = (
    userToken: string,
    walletId: string,
    webhookId: string,
  ): Promise<GetWebhookResponse> =>
    backend.getWebhook(userToken, walletId, webhookId)

  const listWebhooks = (
    userToken: string,
    walletId: string,
    limit: number,
    nextPageToken?: string,
  ): Promise<ListWebhooksResponse> =>
    backend.listWebhooks(userToken, walletId, limit, nextPageToken)

  const createWebhook = (
    userToken: string,
    walletId: string,
    callbackUrl: string,
    settings: Object,
  ): Promise<CreateWebhookResponse> =>
    backend.createWebhook(userToken, walletId, callbackUrl, settings)

  const deleteWebhook = (
    userToken: string,
    walletId: string,
    webhookId: string,
  ): Promise<DeleteWebhookResponse> =>
    backend.deleteWebhook(userToken, walletId, webhookId)

  return {
    getWebhook,
    listWebhooks,
    createWebhook,
    deleteWebhook,
  }
}
