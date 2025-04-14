import express from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import databaseService from '~/services/database.services'
const app = express()

app.use(express.json())
app.get('/', (req, res) => {
  res.status(HTTP_STATUS.OK).json({ message: 'Hello, world!' })
})

const start = async () => {
  await databaseService.connect()
  app.listen(5000, () => console.log('Server started on port 5000'))
}
start()
