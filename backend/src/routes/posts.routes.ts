import { Router } from 'express'
import { createPostController } from '~/controllers/posts.controllers'
import { createPostValidator } from '~/middlewares/posts.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const postRouter = Router()

postRouter
  .route('/')
  .post(accessTokenValidator, verifiedUserValidator, createPostValidator, wrapRequestHandler(createPostController))

export default postRouter
