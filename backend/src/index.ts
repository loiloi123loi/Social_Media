import cors from 'cors'
import express from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import initRoutes from '~/routes'
import databaseService from '~/services/database.services'
const app = express()

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
  res.status(HTTP_STATUS.OK).json({ message: 'Hello, world!' })
})
initRoutes(app)

const start = async () => {
  await databaseService.connect()
  app.listen(5000, () => console.log('Server started on port 5000'))
}
start()
