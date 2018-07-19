import express, { Request, Response } from 'express'
import { RequestHandlerParams } from 'express-serve-static-core';

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world')
})

const server = app.listen(port, () => {
  console.log(`Sakiewka-client server is running at http://localhost${port}`)
})

export default server
