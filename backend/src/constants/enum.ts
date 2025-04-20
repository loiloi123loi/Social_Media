export enum TOKEN_TYPE {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token'
}

export enum USER_VERIFY_STATUS {
  UNVERIFIED = 'unverified',
  VERIFIED = 'verified',
  BANNED = 'banned'
}

export enum MEDIA_TYPE {
  IMAGE = 'image',
  VIDEO = 'video',
  HLS = 'hls'
}

export enum PEOPLE_FOLLOW {
  Anyone = '0',
  Following = '1'
}

export enum POST_TYPE {
  POST = 'post',
  RE_POST = 're_post',
  COMMENT_POST = 'comment_post',
  QUOTE_POST = 'quote_post'
}

export enum POST_AUDIENCE {
  EVERYONE = 'everyone',
  FOLLOWER = 'follower',
  FRIEND = 'friend',
  ONLY_ME = 'only_me'
}
