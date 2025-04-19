import { ObjectId } from 'mongodb'
import { USER_VERIFY_STATUS } from '~/constants/enum'

interface IUser {
  _id?: ObjectId
  name: string
  email: string
  password: string
  verifyStatus: USER_VERIFY_STATUS
  createdAt?: Date
  updatedAt?: Date
}

export default class User {
  _id: ObjectId
  name: string
  email: string
  password: string
  verifyStatus: USER_VERIFY_STATUS
  createdAt: Date
  updatedAt: Date

  constructor({ _id, name, email, password, verifyStatus, createdAt, updatedAt }: IUser) {
    const now = new Date()
    this._id = _id || new ObjectId()
    this.name = name
    this.email = email
    this.password = password
    this.verifyStatus = verifyStatus
    this.createdAt = createdAt || now
    this.updatedAt = updatedAt || now
  }
}
