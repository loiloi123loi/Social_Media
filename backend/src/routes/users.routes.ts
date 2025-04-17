import { Router } from 'express'
import { loginController, refreshTokenController, registerController } from '~/controllers/users.controllers'
import { loginValidator, refreshTokenValidator, registerValidator } from '~/middlewares/users.middlewares'
const userRouter = Router()

userRouter.post('/register', registerValidator, registerController)
userRouter.post('/login', loginValidator, loginController)
userRouter.post('/refresh-token', refreshTokenValidator, refreshTokenController)

export default userRouter
