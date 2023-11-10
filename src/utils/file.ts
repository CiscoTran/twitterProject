import path from 'path'
import fs from 'fs'
import formidable, { File } from 'formidable'
import { Request } from 'express'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'

export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      })
    }
  })
}

export const getNameFromFullName = (filename: string) => {
  const nameArr = filename.split('.')
  nameArr.pop()
  return nameArr.join('')
}

export const getExtension = (filename: string) => {
  const nameArr = filename.split('.')
  return nameArr[nameArr.length - 1]
}

export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve(UPLOAD_IMAGE_TEMP_DIR),
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 300 * 1024 * 4,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }

      if (!files.image) {
        return reject(new Error('Image is empty'))
      }
      return resolve(files.image as File[])
    })
  })
}

export const handleUploadVideo = async (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve(UPLOAD_VIDEO_DIR),
    maxFiles: 1,
    maxFileSize: 50 * 1024 * 1024, //50MB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('video/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }

      if (!files.video) {
        return reject(new Error('Video is empty'))
      }

      const videos = files.video as File[]

      videos.forEach((video) => {
        //lấy ra cái tên cũ và lấy ra đuôi file
        const ext = getExtension(video.originalFilename as string)
        //dùng tên mới + đuôi của tên cũ để thành tên mới đầy đủ
        fs.renameSync(video.filepath, `${video.filepath}.${ext}`)
        video.newFilename = video.newFilename + '.' + ext
      })
      return resolve(files.video as File[])
    })
  })
}
