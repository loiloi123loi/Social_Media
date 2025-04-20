import { ObjectId } from 'mongodb'
import { CreatePostReqBody } from '~/models/requests/Post.requests'
import Post from '~/models/schemas/Post.schemas'
import databaseService from '~/services/database.services'

class PostService {
  async createPost(userId: string, { postType, audience, parentId, content, medias }: CreatePostReqBody) {
    const result = await databaseService.posts.insertOne(
      new Post({
        postType,
        audience,
        userId: new ObjectId(userId),
        parentId: parentId ? new ObjectId(parentId) : undefined,
        content,
        medias
      })
    )
    const post = await databaseService.posts.findOne({
      _id: new ObjectId(result.insertedId)
    })
    return post
  }
}

const postService = new PostService()
export default postService
