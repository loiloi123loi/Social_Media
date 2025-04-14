export interface RegisterUserReqBody {
  name: string
  email: string
  password: string
}

export interface LoginUserReqBody {
  email: string
  password: string
}
