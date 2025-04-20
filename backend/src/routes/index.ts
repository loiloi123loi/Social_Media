import { Express } from 'express'
import { errorHandler, notFoundHandler } from '~/middlewares/errors.middlewares'
import postRouter from '~/routes/posts.routes'
import searchRouter from '~/routes/search.routes'
import userRouter from '~/routes/users.routes'

export default function initRoutes(app: Express) {
  app.use('/api/v1/users', userRouter)
  app.use('/api/v1/search', searchRouter)
  app.use('/api/v1/posts', postRouter)

  app.use(errorHandler)
  app.use(notFoundHandler)
}
