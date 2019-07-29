import { Webhook } from '../domain/webhook'
import { NextPageToken } from '../domain/api'

export type GetWebhookResponse = Webhook
export interface ListWebhooksResponse {
  webhooks: Webhook[]
  nextPageToken?: NextPageToken
}
export interface DeleteWebhookResponse {}
export interface CreateWebhookResponse {
  id: string
}
