import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { MEDIA_TYPE, POST_AUDIENCE, POST_TYPE } from '~/constants/enum'
import { POSTS_MESSAGES } from '~/constants/messages'
import { Media } from '~/models/Other'
import { validate } from '~/utils/validation.utils'

export const createPostValidator = validate(
  checkSchema(
    {
      postType: {
        notEmpty: {
          errorMessage: POSTS_MESSAGES.POST_TYPE_IS_REQUIRED
        },
        isString: {
          errorMessage: POSTS_MESSAGES.POST_TYPE_MUST_BE_A_STRING
        },
        isIn: {
          options: [Object.values(POST_TYPE)],
          errorMessage: POSTS_MESSAGES.POST_TYPE_INVALID + Object.values(POST_TYPE).join(', ')
        }
      },
      audience: {
        notEmpty: {
          errorMessage: POSTS_MESSAGES.AUDIENCE_IS_REQUIRED
        },
        isString: {
          errorMessage: POSTS_MESSAGES.AUDIENCE_MUST_BE_A_STRING
        },
        isIn: {
          options: [Object.values(POST_AUDIENCE)],
          errorMessage: POSTS_MESSAGES.AUDIENCE_INVALID + Object.values(POST_AUDIENCE).join(', ')
        }
      },
      parentId: {
        custom: {
          options: (value, { req }) => {
            const postType = req.body.postType as POST_TYPE
            if (postType !== POST_TYPE.POST && !ObjectId.isValid(value)) {
              throw new Error(POSTS_MESSAGES.PARENT_ID_MUST_BE_A_VALID_POST_ID)
            }
            if (postType === POST_TYPE.POST && value !== null) {
              throw new Error(POSTS_MESSAGES.PARENT_ID_MUST_BE_NULL)
            }
            return true
          }
        }
      },
      content: {
        custom: {
          options: (value, { req }) => {
            const type = req.body.type as POST_TYPE

            if ([POST_TYPE.POST, POST_TYPE.COMMENT_POST, POST_TYPE.QUOTE_POST].includes(type) && !value) {
              throw new Error(POSTS_MESSAGES.CONTENT_MUST_BE_A_NON_EMPTY_STRING)
            }
            if (type === POST_TYPE.RE_POST && value) {
              throw new Error(POSTS_MESSAGES.CONTENT_MUST_BE_EMPTY_STRING)
            }
            return true
          }
        }
      },
      medias: {
        isArray: true,
        custom: {
          options: (value) => {
            if (
              value.some((item: Media) => {
                return typeof item.url !== 'string' || !Object.values(MEDIA_TYPE).includes(item.type)
              })
            ) {
              throw new Error(POSTS_MESSAGES.MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
