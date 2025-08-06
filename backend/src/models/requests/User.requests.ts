export interface RegisterUserReqBody {
  name: string
  email: string
  password: string
}

export interface LoginUserReqBody {
  email: string
  password: string
}

export interface RefreshTokenReqBody {
  refreshToken: string
}

export interface AddFriendRequestReqBody {
  followedUserId: string
}

export interface DeclineFriendRequestReqBody {
  followedUserId: string
}
