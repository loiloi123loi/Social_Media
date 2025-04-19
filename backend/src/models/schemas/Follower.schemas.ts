import { ObjectId } from 'mongodb'

interface IFollower {
  _id?: ObjectId
  userId: ObjectId
  followedUserId: ObjectId
  createdAt?: Date
}

export default class Follower {
  _id: ObjectId
  userId: ObjectId
  followedUserId: ObjectId
  createdAt: Date

  constructor({ _id, userId, followedUserId, createdAt }: IFollower) {
    this._id = _id || new ObjectId()
    this.userId = userId
    this.followedUserId = followedUserId
    this.createdAt = createdAt || new Date()
  }
}
