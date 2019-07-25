import { Webhook } from '../domain-types/webhook'

export interface GetWebhookBackendResponse extends Webhook {}
export interface ListWebhooksBackendResponse {
  webhooks: Webhook[]
}
export interface DeleteWebhookBackendResponse {}
export interface CreateWebhookBackendResponse {
  id: string
}
