import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { LoginUserReqBody, RefreshTokenReqBody, RegisterUserReqBody } from '~/models/requests/User.requests'
import userService from '~/services/users.services'

export const registerController = async (
  req: Request<ParamsDictionary, unknown, RegisterUserReqBody>,
  res: Response
) => {
  const result = await userService.registerUser(req.body)

  res.status(HTTP_STATUS.CREATED).json({
    message: USERS_MESSAGES.REGISTER_USER_SUCCESS,
    data: result
  })
}

export const loginController = async (req: Request<ParamsDictionary, unknown, LoginUserReqBody>, res: Response) => {
  const result = await userService.loginUser(req.user!._id.toString())

  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGIN_USER_SUCCESS,
    data: result
  })
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, unknown, RefreshTokenReqBody>,
  res: Response
) => {
  const { _id } = req.user!

  const result = await userService.refreshToken(_id.toString(), req.decodedRefreshToken!)

  res.json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
    data: result
  })
}
