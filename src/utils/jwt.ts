import jwt from 'jsonwebtoken'
import { TokenPayLoad } from '~/models/requests/User.requests'

//làm hàm nhận vào payload, privateKey, options từ đó ký tên

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer
  privateKey?: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) throw reject(err)
      resolve(token as string)
    })
  })
}

//hàm nhận vào token và secretKeyOrPublicKey?
export const verifyToken = ({
  token,
  secretKeyOrPublicKey = process.env.JWT_SECRET as string
}: {
  token: string
  secretKeyOrPublicKey?: string
}) => {
  return new Promise<TokenPayLoad>((resolve, reject) => {
    jwt.verify(token, secretKeyOrPublicKey, (error, decoded) => {
      if (error) throw reject(error)
      resolve(decoded as TokenPayLoad)
    })
  })
}
