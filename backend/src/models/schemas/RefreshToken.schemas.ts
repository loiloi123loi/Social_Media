import { ObjectId } from 'mongodb'

interface IRefreshToken {
  _id?: ObjectId
  token: string
  createdAt?: Date
  userId: ObjectId
  iat: number
  exp: number
}

export default class RefreshToken {
  _id: ObjectId
  token: string
  createdAt: Date
  userId: ObjectId
  iat: Date
  exp: Date

  constructor({ _id, token, createdAt, userId, iat, exp }: IRefreshToken) {
    this._id = _id || new ObjectId()
    this.token = token
    this.createdAt = createdAt || new Date()
    this.userId = userId
    this.iat = new Date(iat * 1000)
    this.exp = new Date(exp * 1000)
  }
}
