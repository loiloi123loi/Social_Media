import { checkSchema } from 'express-validator'
import { MEDIA_TYPE_QUERY } from '~/constants/enum'
import { validate } from '~/utils/validation.utils'

export const searchValidator = validate(
  checkSchema(
    {
      content: {
        isString: {
          errorMessage: 'Content must be a string'
        }
      },
      mediaType: {
        optional: true,
        isIn: {
          options: [Object.values(MEDIA_TYPE_QUERY)]
        },
        errorMessage: `Invalid media type must be one of ${Object.values(MEDIA_TYPE_QUERY).join(', ')}`
      },
      peopleFollow: {
        optional: true,
        isIn: {
          options: [['0', '1']]
        },
        errorMessage: 'People follow must be 0 or 1'
      }
    },
    ['query']
  )
)
