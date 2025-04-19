import { ObjectId } from 'mongodb'
import { TOKEN_TYPE } from '~/constants/enum'
import { RegisterUserReqBody } from '~/models/requests/User.requests'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import User from '~/models/schemas/User.schemas'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/bcrypt.utils'
import { ITokenPayload, signToken, verifyToken } from '~/utils/jwt.utils'

class UserService {
  private signAccessToken(userId: string) {
    return signToken({
      payload: { userId, tokenType: TOKEN_TYPE.ACCESS_TOKEN },
      secret: process.env.JWT_ACCESS_TOKEN_SECRET as string,
      options: {
        expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN)
      }
    })
  }

  private signRefreshToken(payload: { userId: string; exp?: number }) {
    if (payload.exp) {
      return signToken({
        payload: { ...payload, tokenType: TOKEN_TYPE.REFRESH_TOKEN },
        secret: process.env.JWT_REFRESH_TOKEN_SECRET as string
      })
    }
    return signToken({
      payload: { ...payload, tokenType: TOKEN_TYPE.REFRESH_TOKEN },
      secret: process.env.JWT_REFRESH_TOKEN_SECRET as string,
      options: {
        expiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN)
      }
    })
  }

  private signAccessAndRefreshToken(tokenPayload: { userId: string; exp?: number }) {
    return Promise.all([this.signAccessToken(tokenPayload.userId), this.signRefreshToken(tokenPayload)])
  }

  async isExistEmail(email: string) {
    const user = await databaseService.users.findOne({ email })

    return Boolean(user)
  }

  async registerUser({ name, email, password }: RegisterUserReqBody) {
    const userId = new ObjectId()
    const hashedPassword = await hashPassword(password)

    await databaseService.users.insertOne(new User({ _id: userId, name, email, password: hashedPassword }))
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({ userId: userId.toString() })

    const { iat, exp } = await verifyToken({
      token: refreshToken,
      secret: process.env.JWT_REFRESH_TOKEN_SECRET
    })
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        userId: new ObjectId(userId),
        token: refreshToken,
        iat,
        exp
      })
    )

    return {
      accessToken,
      refreshToken
    }
  }

  async loginUser(userId: string) {
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({ userId })

    const { iat, exp } = await verifyToken({
      token: refreshToken,
      secret: process.env.JWT_REFRESH_TOKEN_SECRET
    })
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        userId: new ObjectId(userId),
        token: refreshToken,
        iat,
        exp
      })
    )

    return {
      accessToken,
      refreshToken
    }
  }

  async refreshToken(userId: string, tokenPayload: ITokenPayload) {
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({ userId, exp: tokenPayload.exp })

    return {
      accessToken,
      refreshToken
    }
  }
}

const userService = new UserService()
export default userService
