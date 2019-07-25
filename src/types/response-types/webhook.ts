import {
  ListWebhooksBackendResponse,
  GetWebhookBackendResponse,
  CreateWebhookBackendResponse,
  DeleteWebhookBackendResponse,
} from '../api-types/webhook'

export interface ListWebhooksResponse extends ListWebhooksBackendResponse {}
export interface GetWebhookResponse extends GetWebhookBackendResponse {}
export interface CreateWebhookResponse extends CreateWebhookBackendResponse {}
export interface DeleteWebhookResponse extends DeleteWebhookBackendResponse {}
