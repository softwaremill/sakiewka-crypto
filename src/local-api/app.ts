import express from 'express'
import bodyParser from 'body-parser'

import clientApp from './client-app'
import notFound from './not-found'
import login from './login'
import { BASE_API_PATH } from '../constants'

const app = express()
app.use(bodyParser.json())

// Endpoints
app.get('/', clientApp)

app.post(`/${BASE_API_PATH}/user/login`, login)

app.get('*', notFound)

export default app
