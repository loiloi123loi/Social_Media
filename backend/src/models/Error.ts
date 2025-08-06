import HTTP_STATUS from '~/constants/httpStatus'
import { COMMONS_MESSAGES } from '~/constants/messages'

export class ErrorWithStatus {
  message: string
  status: number

  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

type ErrorType = {
  [key: string]: {
    msg: string
    [custom: string]: string | number | boolean | object
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorType

  constructor({ message = COMMONS_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorType }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
