import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import config from 'config'

import UserModel from '../models/user.js'

//login func
export const login = async (req, res) => {

  try {
    const SECRET = config.get('SECRET_KEY')
    const { email, password } = req.body
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const isValidPass = await bcrypt.compare(password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      SECRET,
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });

  } catch (error) {
    console.log(error, "Error login");
    res.json({ message: "Не удалось авторизоваться" })
  }
}

//registration
export const registration = async (req, res) => {
  try {
    const { password, email, fullName, avatarUrl } = req.body
    const SECRET = config.get('SECRET_KEY')
    const hash = await bcrypt.hash(password, 10);

    const doc = new UserModel({
      email: email,
      fullName: fullName,
      avatarUrl: avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      SECRET,
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err, 'Error registration');
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};

// checks if the user is registered
export const authMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден"
      })
    }

    const { ...userData } = user._doc;

    res.json(userData);
  } catch (error) {
    console.log(error, "Error authMe");
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
}