import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { TOKEN_TYPE, USER_VERIFY_STATUS } from '~/constants/enum'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Error'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { comparePassword } from '~/utils/bcrypt.utils'
import { ITokenPayload, verifyToken } from '~/utils/jwt.utils'
import { validate } from '~/utils/validation.utils'

export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
        }
      },
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isExist = await userService.isExistEmail(value)
            if (isExist) {
              throw new Error(USERS_MESSAGES.EMAIL_IS_IN_USED)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_1_TO_100
        },
        isStrongPassword: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
      }
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({ email: value })
            if (!user) {
              throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
            }
            const isMatch = await comparePassword(req.body.password, user.password)
            if (!isMatch) {
              throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
            }
            req.user = user
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_1_TO_100
        }
      }
    },
    ['body']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refreshToken: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.REFRESH_TOKEN_MUST_BE_A_STRING
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            try {
              const tokenPayload = await verifyToken({
                token: value,
                secret: process.env.JWT_REFRESH_TOKEN_SECRET
              })
              const { userId, tokenType } = tokenPayload

              if (tokenType !== TOKEN_TYPE.REFRESH_TOKEN) {
                throw new Error(USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID)
              }

              const user = await databaseService.users.findOne({
                _id: new ObjectId(userId)
              })

              if (!user) {
                throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
              }

              req.user = user
              req.decodedRefreshToken = tokenPayload
              return true
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
              throw new Error(USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID)
            }
          }
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.ACCESS_TOKEN_MUST_BE_A_STRING
        },
        custom: {
          options: async (value, { req }) => {
            try {
              value = value.replace('Bearer ', '').trim()
              const tokenPayload = await verifyToken({
                token: value,
                secret: process.env.JWT_ACCESS_TOKEN_SECRET
              })

              const { userId, tokenType } = tokenPayload

              if (tokenType !== TOKEN_TYPE.ACCESS_TOKEN) {
                throw new Error(USERS_MESSAGES.ACCESS_TOKEN_IS_INVALID)
              }

              const user = await databaseService.users.findOne({
                _id: new ObjectId(userId)
              })

              if (!user) {
                throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
              }

              req.user = user
              req.decodedAccessToken = tokenPayload
              return true
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
              throw new Error(USERS_MESSAGES.ACCESS_TOKEN_IS_INVALID)
            }
          }
        }
      }
    },
    ['headers']
  )
)

export const verifiedUserValidator = (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.decodedAccessToken as ITokenPayload
  if (verify !== USER_VERIFY_STATUS.VERIFIED) {
    return next(
      new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_VERIFIED,
        status: HTTP_STATUS.FORBIDDEN
      })
    )
  }
  next()
}
