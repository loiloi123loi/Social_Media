import { Router } from 'express'
import { searchController } from '~/controllers/search.controllers'
import { paginationValidator } from '~/middlewares/commons.middlewares'
import { searchValidator } from '~/middlewares/search.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const searchRouter = Router()

searchRouter
  .route('/')
  .get(
    paginationValidator,
    accessTokenValidator,
    verifiedUserValidator,
    searchValidator,
    wrapRequestHandler(searchController)
  )

export default searchRouter
