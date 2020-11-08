require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const { authorization } = req.headers
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.slice(7, authorization.length)
    try {
      jwt.verify(token, process.env.APP_KEY, (error, decode) => {
        if (error) {
          res.send({
            success: false,
            message: 'Token not verify'
          })
        } else {
          req.user = decode
          next()
        }
      })
    } catch (err) {
      res.send({
        success: false,
        message: `${err}`
      })
    }
  } else {
    res.send({
      success: false,
      message: 'Forbidden access'
    })
  }
}
