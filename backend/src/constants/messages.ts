const USERS_MESSAGES = {
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_IS_IN_USED: 'Email is already in use',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_1_TO_100: 'Password length must be from 1 to 100',
  PASSWORD_MUST_BE_STRONG: 'Password must be strong',
  REGISTER_USER_SUCCESS: 'User registered successfully',
  LOGIN_USER_SUCCESS: 'Login successfully',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_MUST_BE_A_STRING: 'Refresh token must be a string',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  USER_NOT_FOUND: 'User not found',
  REFRESH_TOKEN_SUCCESS: 'Refresh token successfully',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_MUST_BE_A_STRING: 'Access token must be a string',
  ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',
  USER_NOT_VERIFIED: 'User not verified'
} as const

const COMMONS_MESSAGES = {
  LIMIT_INVALID: 'Limit must be an integer greater than 0',
  PAGE_INVALID: 'Page must be an integer greater than 0'
}

export { COMMONS_MESSAGES, USERS_MESSAGES }
