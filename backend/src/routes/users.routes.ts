import { Router } from 'express'
import {
  addFriendRequestController,
  declineFriendRequestController,
  getFriendRequestsController,
  getFriendsController,
  getRecommendFriendsController,
  loginController,
  refreshTokenController,
  registerController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  followUserValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  verifiedUserValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const userRouter = Router()

userRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
userRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
userRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

const protectedRouter = Router()

protectedRouter.use(accessTokenValidator, verifiedUserValidator)

protectedRouter.get('/', wrapRequestHandler(getFriendsController))
protectedRouter
  .route('/requests')
  .get(wrapRequestHandler(getFriendRequestsController))
  .post(followUserValidator, wrapRequestHandler(addFriendRequestController))
  .delete(followUserValidator, wrapRequestHandler(declineFriendRequestController))
protectedRouter.get('/recommend', wrapRequestHandler(getRecommendFriendsController))

userRouter.use('/friends', protectedRouter)

export default userRouter
