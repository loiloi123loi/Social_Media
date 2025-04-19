import { checkSchema } from 'express-validator'
import { COMMONS_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation.utils'

export const paginationValidator = validate(
  checkSchema(
    {
      limit: {
        optional: true,
        isInt: {
          options: { min: 1 },
          errorMessage: COMMONS_MESSAGES.LIMIT_INVALID
        },
        toInt: true
      },
      page: {
        optional: true,
        isInt: {
          options: { min: 1 },
          errorMessage: COMMONS_MESSAGES.PAGE_INVALID
        },
        toInt: true
      }
    },
    ['query']
  )
)
