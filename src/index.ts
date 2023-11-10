import express, { NextFunction, Request, Response } from 'express'
import usersRoute from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
import { MongoClient } from 'mongodb'

config()

const app = express()
const PORT = process.env.PORT || 4000
initFolder()
databaseService.connect().then(() => {
  databaseService.indexUsers()
})
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/users', usersRoute)
app.use('/medias', mediasRouter)
// app.use('/static', express.static(UPLOAD_IMAGE_DIR))
app.use('/static', staticRouter)
// app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`)
})
