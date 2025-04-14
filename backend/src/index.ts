import express from 'express'
import databaseService from '~/services/database.services'
const app = express()

const start = async () => {
  await databaseService.connect()
  app.listen(5000, () => console.log('Server started on port 5000'))
}
start()
