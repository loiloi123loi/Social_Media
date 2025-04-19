import User from '~/models/schemas/User.schemas'
import { ITokenPayload } from '~/utils/jwt.utils'

declare module 'express' {
  export interface Request {
    user?: User
    decodedRefreshToken?: ITokenPayload
    decodedAccessToken?: ITokenPayload
  }
}
