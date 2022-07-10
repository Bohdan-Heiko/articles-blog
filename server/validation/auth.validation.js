import { body } from 'express-validator'

export const registerValidator = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5, max: 15 }),
  body('fullName', 'Имя должено быть минимум 3 символа').isLength({ min: 3 }),
  body('avatarUrl', 'Неверная ссылка на автара').optional().isURL()
]