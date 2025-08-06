import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import {
  AddFriendRequestReqBody,
  DeclineFriendRequestReqBody,
  LoginUserReqBody,
  RefreshTokenReqBody,
  RegisterUserReqBody
} from '~/models/requests/User.requests'
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
  const result = await userService.loginUser({ userId: req.user!._id.toString(), verifyStatus: req.user!.verifyStatus })

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

  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
    data: result
  })
}

export const getFriendsController = async (req: Request, res: Response) => {
  const userId = req.user!._id
  const result = await userService.getFriends({ userId: userId.toString() })

  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.GET_FRIENDS_SUCCESS,
    data: result
  })
}

export const getFriendRequestsController = async (req: Request, res: Response) => {
  const userId = req.user!._id
  const result = await userService.getFriendRequests({ userId: userId.toString() })

  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.GET_FRIEND_REQUESTS_SUCCESS,
    data: result
  })
}

export const addFriendRequestController = async (
  req: Request<ParamsDictionary, unknown, AddFriendRequestReqBody>,
  res: Response
) => {
  const userId = req.user!._id
  const { followedUserId } = req.body
  const { request } = await userService.addFriendRequest({ userId: userId.toString(), followedUserId })

  res.status(HTTP_STATUS.CREATED).json({
    message: USERS_MESSAGES.ADD_FRIEND_REQUEST_SUCCESS,
    data: {
      request
    }
  })
}

export const declineFriendRequestController = async (
  req: Request<ParamsDictionary, unknown, DeclineFriendRequestReqBody>,
  res: Response
) => {
  const userId = req.user!._id
  const { followedUserId } = req.body
  await userService.declineFriendRequest({ userId: userId.toString(), followedUserId })

  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.DECLINE_FRIEND_REQUEST_SUCCESS
  })
}

export const getRecommendFriendsController = async (req: Request, res: Response) => {
  const userId = req.user!._id
  const result = await userService.getRecommendFriends({ userId: userId.toString() })

  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.GET_RECOMMEND_FRIENDS_SUCCESS,
    data: result
  })
}
