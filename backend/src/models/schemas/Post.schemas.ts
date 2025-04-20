import { ObjectId } from 'mongodb'
import { POST_AUDIENCE, POST_TYPE } from '~/constants/enum'
import { Media } from '~/models/Other'

interface IPost {
  _id?: ObjectId
  userId: ObjectId
  postType: POST_TYPE
  audience: POST_AUDIENCE
  content: string
  parentId?: ObjectId
  medias?: Media[]
  guestViews?: number
  userViews?: number
  updatedAt?: Date
  createdAt?: Date
}

export default class Post {
  _id: ObjectId
  userId: ObjectId
  postType: POST_TYPE
  audience: POST_AUDIENCE
  content: string
  parentId: ObjectId | null
  medias: Media[]
  guestViews: number
  userViews: number
  updatedAt: Date
  createdAt: Date

  constructor({
    _id,
    userId,
    postType,
    audience,
    content,
    parentId,
    medias,
    guestViews,
    userViews,
    updatedAt,
    createdAt
  }: IPost) {
    const date = new Date()
    this._id = _id || new ObjectId()
    this.userId = userId
    this.postType = postType
    this.audience = audience
    this.content = content
    this.parentId = parentId || null
    this.medias = medias || []
    this.guestViews = guestViews || 0
    this.userViews = userViews || 0
    this.updatedAt = updatedAt || date
    this.createdAt = createdAt || date
  }
}
