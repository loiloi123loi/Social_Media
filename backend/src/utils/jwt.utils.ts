import jwt from 'jsonwebtoken'
import { TOKEN_TYPE } from '~/constants/enum'

export interface ITokenPayload extends jwt.JwtPayload {
  userId: string
  tokenType: TOKEN_TYPE
  iat: number
  exp: number
}

export const signToken = ({
  payload,
  secret = process.env.JWT_SECRET as string,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: object
  secret?: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secret, options, (error, key) => {
      if (error) {
        throw reject(error)
      }
      resolve(key as string)
    })
  })
}

export const verifyToken = ({
  token,
  secret = process.env.JWT_SECRET as string
}: {
  token: string
  secret?: string
}) => {
  return new Promise<ITokenPayload>((resolve, reject) => {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decoded as ITokenPayload)
    })
  })
}
