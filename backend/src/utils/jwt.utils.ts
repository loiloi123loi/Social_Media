import jwt from 'jsonwebtoken'

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
