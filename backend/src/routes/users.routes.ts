import { Router } from 'express'
import { loginController, refreshTokenController, registerController } from '~/controllers/users.controllers'
import { loginValidator, refreshTokenValidator, registerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const userRouter = Router()

userRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
userRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
userRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

export default userRouter
