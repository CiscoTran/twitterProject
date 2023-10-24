import express, { NextFunction, Request, Response } from 'express'
import usersRoute from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'

const app = express()
const PORT = 3000
databaseService.connect()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/users', usersRoute)

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`)
})
