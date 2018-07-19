import { Request, Response } from 'express'

import { API_ERROR } from '../constants'

const clientApp = (req: Request, res: Response) => {
  res.send('This endpoint will serve html app')
}

export default clientApp
