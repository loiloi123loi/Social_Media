export interface IValidationError {
  msg: string
  [key: string]: unknown
}

export interface IApiErrorResponse {
  message: string
  errorInfo: {
    [key: string]: IValidationError
  }
}

export interface IApiSuccessResponse<T> {
  message: string
  data: T
}

export type IApiResponse<T> = {
  message: string
} & (
  | {
      data: T
      errorInfo?: never
    }
  | {
      data?: never
      errorInfo: {
        [key: string]: IValidationError
      }
    }
)
