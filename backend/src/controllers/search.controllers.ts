import { Request, Response } from 'express'

export const searchController = async (req: Request, res: Response) => {
  const { limit, page } = req.query

  res.json({ message: '123' })
}
