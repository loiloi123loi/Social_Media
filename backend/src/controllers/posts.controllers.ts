import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { POSTS_MESSAGES } from '~/constants/messages'
import { CreatePostReqBody } from '~/models/requests/Post.requests'
import postService from '~/services/posts.services'
import { ITokenPayload } from '~/utils/jwt.utils'

export const createPostController = async (
  req: Request<ParamsDictionary, unknown, CreatePostReqBody>,
  res: Response
) => {
  const { userId } = req.decodedAccessToken as ITokenPayload
  const result = await postService.createPost(userId, req.body)

  res.status(HTTP_STATUS.OK).json({
    message: POSTS_MESSAGES.CREATE_POST_SUCCESS,
    result
  })
}
