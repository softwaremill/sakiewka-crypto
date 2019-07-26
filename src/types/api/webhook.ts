import { Webhook } from '../domain/webhook'
import { NextPageToken } from '../domain/api'

export type GetWebhookBackendResponse = Webhook
export interface ListWebhooksBackendResponse {
  webhooks: Webhook[]
  nextPageToken?: NextPageToken
}
export interface DeleteWebhookBackendResponse {}
export interface CreateWebhookBackendResponse {
  id: string
}
