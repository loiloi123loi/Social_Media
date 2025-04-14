import { ObjectId } from 'mongodb'

interface IUser {
  _id?: ObjectId
  name: string
  email: string
  password: string
  createdAt?: Date
  updatedAt?: Date
}

export default class User {
  _id: ObjectId
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date

  constructor({ _id, name, email, password, createdAt, updatedAt }: IUser) {
    const now = new Date()
    this._id = _id || new ObjectId()
    this.name = name
    this.email = email
    this.password = password
    this.createdAt = createdAt || now
    this.updatedAt = updatedAt || now
  }
}
