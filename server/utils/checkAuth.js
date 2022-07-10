import jwt from 'jsonwebtoken'
import config from 'config'

// middleware token validation function
export const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, config.get('SECRET_KEY'));

      req.userId = decoded._id;
      next();
    } catch (e) {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }
  } else {
    return res.status(403).json({
      message: "Нет доступа 2"
    })
  }

}