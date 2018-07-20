import { Request, Response } from 'express'

const clientApp = async (req: Request, res: Response) => {
  res.send('This endpoint will serve html app')
}

export default clientApp
