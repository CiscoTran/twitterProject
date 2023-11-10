import { Request, Response } from 'express'
import formidable from 'formidable'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import mediaService from '~/services/medias.services'
import fs from 'fs'
import mime from 'mime'

export const uploadImageController = async (req: Request, res: Response) => {
  const url = await mediaService.uploadImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const uploadVideoController = async (req: Request, res: Response) => {
  const url = await mediaService.uploadVideo(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const serveImageController = async (req: Request, res: Response) => {
  const { namefile } = req.params
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, namefile), (err) => {
    if (err) {
      res.status((err as any).status).send('Not found image')
    }
  })
}

export const serveVideoController = async (req: Request, res: Response) => {
  const { namefile } = req.params
  const range = req.headers.range
  //lấy được đường dẫn của video
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, namefile)
  if (!range) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Require range header')
  }
  //lấy kích thước của video
  const videoSize = fs.statSync(videoPath).size
  const CHUNK_SIZE = 10 ** 6 //1MB
  const start = Number(range.replace(/\D/g, ''))
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1)

  //dung lượng cần load thực tế
  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*'
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videoStream = fs.createReadStream(videoPath, { start, end })
  videoStream.pipe(res)
}
