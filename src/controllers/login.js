const { User } = require('../models')
const joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
  login: async (req, res) => {
    try {
      const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
      })
      const { value, error } = schema.validate(req.body)
      const { email, password } = value
      if (error) {
        res.send({
          success: false,
          message: `${error}`
        })
      } else {
        const checkUser = await User.findAll({ where: { email: email } })
        if (checkUser.length > 0) {
          const checkPasswordDb = checkUser[0].password
          const comparePassword = bcrypt.compareSync(password, checkPasswordDb)
          if (comparePassword === true) {
            const jwtToken = {
              id: checkUser[0].id,
              name: checkUser[0].name,
              birthdate: checkUser[0].birthdate,
              role: checkUser[0].role,
              photo: checkUser[0].photo
            }
            const token = jwt.sign({ jwtToken }, process.env.APP_KEY)
            res.send({
              success: true,
              message: 'Login successfully',
              results: token
            })
          } else {
            res.send({
              success: false,
              message: 'Password does not match'
            })
          }
        } else {
          res.send({
            success: false,
            message: 'Wrong email'
          })
        }
      }
    } catch (err) {
      res.send({
        success: false,
        message: `${err}`
      })
    }
  }
}
