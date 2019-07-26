import { Webhook } from '../domain-types/webhook'
import { NextPageToken } from '../domain-types/api'

export type GetWebhookBackendResponse = Webhook
export interface ListWebhooksBackendResponse {
  webhooks: Webhook[]
  nextPageToken?: NextPageToken
}
export interface DeleteWebhookBackendResponse {}
export interface CreateWebhookBackendResponse {
  id: string
}
