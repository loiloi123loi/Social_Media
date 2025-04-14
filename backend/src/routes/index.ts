import { Express } from 'express'
import { errorHandler, notFoundHandler } from '~/middlewares/errors.middlewares'
import userRouter from '~/routes/users.routes'

export default function initRoutes(app: Express) {
  app.use('/api/v1/users', userRouter)

  app.use(errorHandler)
  app.use(notFoundHandler)
}
