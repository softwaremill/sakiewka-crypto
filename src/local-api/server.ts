import express from 'express'

import clientApp from './client-app'
import notFound from './not-found'

const app = express()
const port = process.env.PORT || 3000

// Endpoints
app.get('/', clientApp)
app.get('*', notFound)

const server = app.listen(port, () => {
  console.log(`Sakiewka-client server is running at http://localhost${port}`)
})

export default server
