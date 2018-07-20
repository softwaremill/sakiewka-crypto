import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'

import dotenv from 'dotenv'
import clientApp from './client-app'
import notFound from './not-found'
import login from './login'
import info from './info'
import register from './register'
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

// Endpoints
app.get('/', errorHandled(clientApp))

app.post(`/${BASE_API_PATH}/user/login`, errorHandled(login))
app.post(`/${BASE_API_PATH}/user/register`, errorHandled(register))
app.get(`/${BASE_API_PATH}/user/info`, errorHandled(info))

app.get('*', errorHandled(notFound))

export default app
