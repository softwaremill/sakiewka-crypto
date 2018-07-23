import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'

import dotenv from 'dotenv'
import clientApp from './handlers/client-app'
import notFound from './handlers/not-found'
import login from './handlers/login'
import info from './handlers/info'
import register from './handlers/register'
import createWallet from './handlers/create-wallet'
import listWallets from './handlers/list-wallets'
import getWallet from './handlers/get-wallet'
import createKey from './handlers/create-key'
import { BASE_API_PATH, API_ERROR } from '../common/constants'
import { errorResponse } from './response'

dotenv.config()

const app = express()
app.use(bodyParser.json())

// catches middleware errors
app.use((err: Error, req: Request, res: Response, next: Function) => {
  if (err) {
    errorResponse(res, API_ERROR.BAD_REQUEST)
  }
  next()
})

// catches server errors
const errorHandled = (fn: Function) => {
  return (req: Request, res: Response, next: Function) => {
    fn(req, res)
      .catch((err: Error) => {
        errorResponse(res, API_ERROR.SERVER_ERROR)
      })
  }
}

// ENDPOINTS

// site
app.get('/', errorHandled(clientApp))

// user
app.post(`/${BASE_API_PATH}/user/login`, errorHandled(login))
app.post(`/${BASE_API_PATH}/user/register`, errorHandled(register))
app.get(`/${BASE_API_PATH}/user/info`, errorHandled(info))

// wallet
app.post(`/${BASE_API_PATH}/btc/wallet/create`, errorHandled(createWallet))
app.get(`/${BASE_API_PATH}/btc/wallet`, errorHandled(listWallets))
app.get(`/${BASE_API_PATH}/btc/wallet/:id`, errorHandled(getWallet))

// key
app.post(`/${BASE_API_PATH}/btc/key/create`, errorHandled(createKey))

app.get('*', errorHandled(notFound))

export default app
