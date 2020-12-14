const { User } = require('../models')
const joi = require('joi')
const bcrypt = require('bcrypt')

module.exports = {
  register: async (req, res) => {
    try {
      const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required()
      })

      const { value, error } = schema.validate(req.body)
      const { name, email, password } = value

      if (error) {
        res.send({
          success: false,
          message: `${error}`
        })
      } else {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        // check email
        const checkEmail = await User.findAll({ where: { email: email } })
        if (checkEmail.length > 0) {
          res.send({
            success: false,
            message: 'Email already registerd'
          })
        } else {
          const data = {
            name, birthdate: '2000-01-01', email, password: hash, photo: ''
          }
          const registerd = await User.create(data)
          if (registerd) {
            res.send({
              success: true,
              message: 'Register successfully',
              results: registerd
            })
          } else {
            res.send({
              success: false,
              message: 'Register fail'
            })
          }
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
