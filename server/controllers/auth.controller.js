import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import config from 'config'

import UserModel from '../models/user.js'


export const login = (req, res) => {

  const { email, name } = req.body
  const SECRET = config.get('SECRET_KEY')

  const token = jwt.sign({
    email,
    name
  }, SECRET)

  res.send({
    success: true,
    token
  })
}


export const registration = async (req, res) => {
  try {
    const SECRET = config.get('SECRET_KEY')
    const errors = validationResult(req)
    console.log(req.body);

    const { email, password, fullName, imageUrl } = req.body

    if (!errors.isEmpty()) {
      return res.status(401).json(errors.array())
    }
    const hashPassword = await bcrypt.hash(password, 10)

    const user = new UserModel({
      email, fullName, imageUrl, hashPassword
    })

    const token = jwt.sign({
      _id: user._id
    }, SECRET, 
    {
      expiresIn: '30d'
    })
    
    await user.save()

    res.json({
      user,
      token
    })

  } catch (error) {
    console.log(error);
    res.json({message: "Не удалось зарегестрировать пользователя"})
  }
}