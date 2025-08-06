import { ObjectId } from 'mongodb'
import { TOKEN_TYPE, USER_VERIFY_STATUS } from '~/constants/enum'
import { RegisterUserReqBody } from '~/models/requests/User.requests'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import User from '~/models/schemas/User.schemas'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/bcrypt.utils'
import { ITokenPayload, signToken, verifyToken } from '~/utils/jwt.utils'

class UserService {
  private signAccessToken({ userId, verifyStatus }: { userId: string; verifyStatus: USER_VERIFY_STATUS }) {
    return signToken({
      payload: { userId, verifyStatus, tokenType: TOKEN_TYPE.ACCESS_TOKEN },
      secret: process.env.JWT_ACCESS_TOKEN_SECRET as string,
      options: {
        expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN)
      }
    })
  }

  private signRefreshToken({
    userId,
    verifyStatus,
    exp
  }: {
    userId: string
    verifyStatus: USER_VERIFY_STATUS
    exp?: number
  }) {
    if (exp) {
      return signToken({
        payload: { userId, verifyStatus, tokenType: TOKEN_TYPE.REFRESH_TOKEN },
        secret: process.env.JWT_REFRESH_TOKEN_SECRET as string
      })
    }
    return signToken({
      payload: { userId, verifyStatus, tokenType: TOKEN_TYPE.REFRESH_TOKEN },
      secret: process.env.JWT_REFRESH_TOKEN_SECRET as string,
      options: {
        expiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN)
      }
    })
  }

  private signAccessAndRefreshToken(tokenPayload: { userId: string; verifyStatus: USER_VERIFY_STATUS; exp?: number }) {
    return Promise.all([this.signAccessToken(tokenPayload), this.signRefreshToken(tokenPayload)])
  }

  async isExistEmail(email: string) {
    const user = await databaseService.users.findOne({ email })

    return Boolean(user)
  }

  async registerUser({ name, email, password }: RegisterUserReqBody) {
    const userId = new ObjectId()
    const hashedPassword = await hashPassword(password)

    await databaseService.users.insertOne(
      new User({
        _id: userId,
        name,
        email,
        password: hashedPassword,
        verifyStatus: USER_VERIFY_STATUS.UNVERIFIED
      })
    )
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
      userId: userId.toString(),
      verifyStatus: USER_VERIFY_STATUS.UNVERIFIED
    })

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

  async loginUser({ userId, verifyStatus }: { userId: string; verifyStatus: USER_VERIFY_STATUS }) {
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
      userId,
      verifyStatus
    })

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
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
      userId,
      verifyStatus: tokenPayload.verifyStatus,
      exp: tokenPayload.exp
    })

    return {
      accessToken,
      refreshToken
    }
  }

  async getFriends({ userId }: { userId: string }) {
    const [{ friends, total }] = await databaseService.followers
      .aggregate(
        [
          {
            $match: {
              userId: new ObjectId(userId)
            }
          },
          {
            $lookup: {
              from: 'followers',
              let: {
                followedId: '$followedUserId',
                currentId: '$userId'
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$userId', '$$followedId']
                        },
                        {
                          $eq: ['$followedUserId', '$$currentId']
                        }
                      ]
                    }
                  }
                }
              ],
              as: 'followBack'
            }
          },
          { $match: { followBack: { $ne: [] } } },
          {
            $lookup: {
              from: 'users',
              localField: 'followedUserId',
              foreignField: '_id',
              as: 'user'
            }
          },
          { $unwind: '$user' },
          {
            $project: {
              _id: '$followedUserId',
              friendAt: '$createdAt',
              name: '$user.name',
              verifyStatus: '$user.verifyStatus',
              createdAt: '$user.createdAt'
            }
          },
          {
            $facet: {
              total: [{ $count: 'count' }],
              friends: [{ $skip: 0 }, { $limit: 1 }]
            }
          },
          {
            $project: {
              total: {
                $ifNull: [{ $arrayElemAt: ['$total.count', 0] }, 0]
              },
              friends: 1
            }
          }
        ],
        { maxTimeMS: 60000, allowDiskUse: true }
      )
      .toArray()

    return {
      friends,
      total
    }
  }

  async getFriendRequests({ userId }: { userId: string }) {
    return {
      requests: []
    }
  }

  async addFriendRequest({ userId, followedUserId }: { userId: string; followedUserId: string }) {
    const result = await databaseService.followers.findOneAndUpdate(
      {
        userId: new ObjectId(userId),
        followedUserId: new ObjectId(followedUserId)
      },
      {
        $setOnInsert: {
          userId: new ObjectId(userId),
          followedUserId: new ObjectId(followedUserId),
          createdAt: new Date()
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )

    return {
      request: result
    }
  }

  async declineFriendRequest({ userId, followedUserId }: { userId: string; followedUserId: string }) {
    return {
      requests: []
    }
  }

  async getRecommendFriends({ userId }: { userId: string }) {
    return {
      recommendedFriends: []
    }
  }
}

const userService = new UserService()
export default userService
