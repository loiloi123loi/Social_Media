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
  ACCESS_TOKEN_IS_EXPIRED: 'Access token is expired',
  USER_NOT_VERIFIED: 'User not verified',
  GET_FRIENDS_SUCCESS: 'Get friends successfully',
  GET_FRIEND_REQUESTS_SUCCESS: 'Get friend requests successfully',
  ADD_FRIEND_REQUEST_SUCCESS: 'Add friend request successfully',
  ACCEPT_FRIEND_REQUEST_SUCCESS: 'Accept friend request successfully',
  DECLINE_FRIEND_REQUEST_SUCCESS: 'Decline friend request successfully',
  REMOVE_FRIEND_SUCCESS: 'Remove friend successfully',
  GET_RECOMMEND_FRIENDS_SUCCESS: 'Get recommended friends successfully',
  CANNOT_FOLLOW_YOURSELF: 'Cannot follow yourself',
  FOLLOWED_USER_ID_IS_REQUIRED: 'Followed user ID is required',
  FOLLOWED_USER_ID_IS_INVALID: 'Followed user ID is invalid',
  REQUEST_ID_IS_REQUIRED: 'Request ID is required',
  REQUEST_ID_IS_INVALID: 'Request ID is invalid'
} as const

const COMMONS_MESSAGES = {
  LIMIT_INVALID: 'Limit must be an integer greater than 0',
  PAGE_INVALID: 'Page must be an integer greater than 0',
  VALIDATION_ERROR: 'Validation error'
}

const POSTS_MESSAGES = {
  POST_TYPE_IS_REQUIRED: 'Post type is required',
  POST_TYPE_MUST_BE_A_STRING: 'Post type must be a string',
  POST_TYPE_INVALID: 'Post type must be one of ',
  AUDIENCE_IS_REQUIRED: 'Audience is required',
  AUDIENCE_MUST_BE_A_STRING: 'Audience must be a string',
  AUDIENCE_INVALID: 'Audience must be one of ',
  PARENT_ID_MUST_BE_A_VALID_POST_ID: 'Parent ID must be a valid post ID',
  PARENT_ID_MUST_BE_NULL: 'Parent ID must be null',
  CONTENT_MUST_BE_A_NON_EMPTY_STRING: 'Content must be a non-empty string',
  CONTENT_MUST_BE_EMPTY_STRING: 'Content must be an empty string',
  MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT: 'Medias must be an array of media object',
  CREATE_POST_SUCCESS: 'Create post successfully'
}

export { COMMONS_MESSAGES, POSTS_MESSAGES, USERS_MESSAGES }
