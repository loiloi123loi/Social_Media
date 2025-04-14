import dotenv from 'dotenv'
import { Db, MongoClient } from 'mongodb'

const isDevelopment = process.env.NODE_ENV || 'development'
dotenv.config({ path: isDevelopment ? '.env.development' : '.env' })

const uri = isDevelopment
  ? `mongodb://localhost:27017/${process.env.DB_NAME}`
  : `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@nodejs.kzpdxv2.mongodb.net/?retryWrites=true&w=majority&appName=Nodejs`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Server successfully connected to MongoDB!')
    } catch (error) {
      console.error('MongoDB connection error:', error)
      throw error
    }
  }
}

const databaseService = new DatabaseService()
export default databaseService
