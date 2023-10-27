import { Request, Response } from 'express'
import databaseService from '~/services/database.services'
import User from '~/models/schemas/User.schema'
import userService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'

export const loginController = async (req: Request, res: Response) => {
  //lấy user_id từ user của req
  const user = req.user as User
  const user_id = user._id as ObjectId
  //dùng user_id để tạo access_token và refresh_token
  const result = await userService.login(user_id.toString())
  //res access_token và refresh_token cho client
  res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  //tạo 1 user mới và bỏ vào collection users trong database
  const result = await userService.register(req.body)
  res.status(201).json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}
