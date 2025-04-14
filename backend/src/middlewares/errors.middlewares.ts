import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // if (err instanceof ErrorWithStatus) {
  //   return res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(omit(err, ['status']))
  // }
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfo: omit(err, ['stack'])
  })
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Route not found' })
}
