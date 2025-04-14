import User from '~/models/schemas/User.schemas'

declare module 'express' {
  export interface Request {
    user?: User
  }
}
