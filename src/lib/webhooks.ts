import * as backendApiFactory from './backend-api'
import { Currency } from '..'

export default (currency: Currency) => {
  const backendApi = backendApiFactory.withCurrency(currency)

  const getWebhook = (userToken: string, walletId: string, webhookId: string) =>
    backendApi.getWebhook(userToken, walletId, webhookId)

  const listWebhooks = (userToken: string, walletId: string, limit: number = 10) =>
    backendApi.listWebhooks(userToken, walletId, limit)

  const createWebhook = (userToken: string, walletId: string, callbackUrl: string, settings: Object) =>
    backendApi.createWebhook(userToken, walletId, callbackUrl, settings)

  const deleteWebhook = (userToken: string, walletId: string, webhookId: string) =>
    backendApi.deleteWebhook(userToken, walletId, webhookId)

  return {
    getWebhook,
    listWebhooks,
    createWebhook,
    deleteWebhook
  }
}
