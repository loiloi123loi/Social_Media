import { ObjectId } from 'mongodb'
import { MEDIA_TYPE, PEOPLE_FOLLOW } from '~/constants/enum'
import databaseService from '~/services/database.services'

class SearchService {
  async search({
    content,
    limit,
    page,
    userId,
    mediaType,
    peopleFollow
  }: {
    content: string
    limit: number
    page: number
    userId: string
    mediaType?: MEDIA_TYPE
    peopleFollow?: PEOPLE_FOLLOW
  }) {
    const $match: Record<string, object | MEDIA_TYPE> = {
      $text: {
        $search: content
      }
    }
    if (mediaType === MEDIA_TYPE.IMAGE) {
      $match['medias.type'] = MEDIA_TYPE.IMAGE
    } else if (mediaType === MEDIA_TYPE.VIDEO) {
      $match['medias.type'] = {
        $in: [MEDIA_TYPE.VIDEO, MEDIA_TYPE.HLS]
      }
    }
    if (peopleFollow && peopleFollow === PEOPLE_FOLLOW.Following) {
      const followedUserIds = await databaseService.followers
        .find(
          { userId: new ObjectId(userId) },
          {
            projection: {
              _id: 0,
              followedUserId: 1
            }
          }
        )
        .toArray()
      const ids = followedUserIds.map((item) => item.followedUserId)
      ids.push(new ObjectId(userId))
      $match['userId'] = { $in: ids }
    }

    // todo find post
    return {
      posts: [],
      total: 0
    }
  }
}

const searchService = new SearchService()
export default searchService
