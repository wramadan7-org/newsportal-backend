const { User } = require('../../models')
const { Op } = require('sequelize')
const joi = require('joi')
const bcrypt = require('bcrypt')

module.exports = {
  createUser: async (req, res) => {
    try {
      const schema = joi.object({
        name: joi.string().required(),
        birthdate: joi.date().required(),
        email: joi.string().email().required(),
        password: joi.string().required()
      })

      const { value, error } = schema.validate(req.body)
      // ambil isi dari valie di schema
      const { name, birthdate, email, password } = value
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)
      // check email
      const checkEmail = await User.findAll({ where: { email: email } })
      if (checkEmail.length) {
        res.send({
          success: false,
          message: 'Email is already registered'
        })
      } else {
        const data = {
          name, birthdate, email, password: hash
        }
        const results = await User.create(data)

        if (error) {
          res.send({
            success: false,
            message: 'Fill all column currectly'
          })
        } else {
          if (results) {
            res.send({
              success: true,
              message: 'Success add users',
              results
            })
          } else {
            res.send({
              success: false,
              message: 'Fail'
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
  },

  getUsers: async (req, res) => {
    try {
      const { search } = req.query
      // searching
      if (search) {
        const searchValue = search || ''
        const results = await User.findAll({ where: { name: { [Op.like]: `%${searchValue}%` } } })
        if (results.length) {
          res.send({
            success: true,
            message: 'Your search data',
            results
          })
        } else {
          res.send({
            success: false,
            message: 'Data not found'
          })
        }
      } else {
        const results = await User.findAll({ attributes: { exclude: ['password'] } })
        if (results) {
          res.send({
            success: true,
            message: 'All data users',
            results
          })
        } else {
          res.send({
            success: false,
            message: 'Fail to get all users'
          })
        }
      }
    } catch (err) {
      res.send({
        success: false,
        message: `${err}`
      })
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params
      const getUser = await User.findAll({ where: { id } })
      // console.log(getUser[0].email)
      if (getUser.length) {
        const schema = joi.object({
          name: joi.string().required(),
          birthdate: joi.date().required(),
          email: joi.string().email().required(),
          password: joi.string().required()
        })
        const { value, error } = schema.validate(req.body)
        const { name, birthdate, email, password } = value

        if (error) {
          res.send({
            success: false,
            message: `${error}`
          })
        } else {
          if (email === getUser[0].email || email !== getUser[0].email) {
            const emailFromParams = getUser[0].email
            // query untuk melihat email selain email dari id tersebut
            const findEmailAnother = await User.findAll({
              where: { email: { [Op.ne]: emailFromParams } }
            })
            // mengambil email lain
            const maps = findEmailAnother.map(o => {
              return o.email
            })
            // cek apakah email inputan ada yg sama dengan id email lain
            const checkEmail = maps.some(item => item === email)
            if (checkEmail === false) {
              const salt = bcrypt.genSaltSync(10)
              const hash = bcrypt.hashSync(password, salt)
              const data = {
                name, birthdate, email, password: hash
              }
              const updateUser = await User.update(data, { where: { id } })
              if (updateUser.length) {
                // ambil data setelah diupdate
                const getUserAfterUpdate = await User.findAll({ where: { id } })
                res.send({
                  success: true,
                  message: 'Updated successfully',
                  results: getUserAfterUpdate[0]
                })
              }
            } else {
              res.send({
                success: false,
                message: 'Email already exists'
              })
            }
          }
        }
      }
    } catch (err) {
      res.send({
        success: false,
        message: `${err}`
      })
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params
      const checkUser = await User.findAll({ where: { id: id } })
      if (checkUser.length) {
        const deleteUser = await User.destroy({ where: { id: id } })
        if (deleteUser) {
          res.send({
            success: true,
            message: 'Delete success'
          })
        }
      } else {
        res.send({
          success: false,
          message: 'Data not found'
        })
      }
    } catch (err) {
      res.send({
        success: false,
        message: `${err}`
      })
    }
  }
}
