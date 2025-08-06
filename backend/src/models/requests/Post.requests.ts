import { POST_AUDIENCE, POST_TYPE } from '~/constants/enum'
import { Media } from '~/models/Other'

export interface CreatePostReqBody {
  postType: POST_TYPE
  audience: POST_AUDIENCE
  parentId: string | null
  content: string
  medias: Media[]
}
