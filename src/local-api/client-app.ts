import { Request, Response } from 'express'

const clientApp = (req: Request, res: Response) => {
  res.send('This endpoint will serve html app')
}

export default clientApp
