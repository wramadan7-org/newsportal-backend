const { User } = require('../models')
const { Op } = require('sequelize')
const joi = require('joi')
const bcrypt = require('bcrypt')

module.exports = {
  createUser: async (req, res) => {
    try {
      const { role } = req.user.jwtToken
      if (role === 'admin') {
        const schema = joi.object({
          name: joi.string().required(),
          birthdate: joi.date().required(),
          email: joi.string().email().required(),
          password: joi.string().required(),
          role: joi.string().required()
        })

        const { value, error } = schema.validate(req.body)
        // ambil isi dari valie di schema
        if (error) {
          res.send({
            success: false,
            message: `${error}`
          })
        } else {
          const { name, birthdate, email, password, role } = value
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
            if (req.file === undefined) {
              if (role === 'admin' || role === 'jurnalis' || role === 'user') {
                const data = {
                  name, birthdate, email, password: hash, role, photo: ''
                }
                const results = await User.create(data)
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
              } else {
                res.send({
                  success: false,
                  message: 'Role does not match'
                })
              }
            } else {
              if (role === 'admin' || role === 'jurnalis' || role === 'user') {
                const photo = `uploads/${req.file.filename}`
                const data = {
                  name, birthdate, email, password: hash, role, photo: photo
                }
                const results = await User.create(data)
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
              } else {
                res.send({
                  success: false,
                  message: 'Role does not match'
                })
              }
            }
          }
        }
      } else {
        res.send({
          success: false,
          message: 'You are not admin'
        })
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
      // const { role } = req.user.jwtToken
      // if (role === 'admin') {
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
      // } else {
      //   res.send({
      //     success: false,
      //     message: 'You are not admin'
      //   })
      // }
    } catch (err) {
      res.send({
        success: false,
        message: `${err}`
      })
    }
  },

  getPersonal: async (req, res) => {
    try {
      const { id } = req.user.jwtToken
      const results = await User.findAll({ where: { id: id } })
      if (results.length) {
        res.send({
          success: true,
          message: 'Your profile',
          results
        })
      } else {
        res.send({
          success: false,
          message: 'Fail to get profile'
        })
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
      // const idFromJwt = req.user.jwtToken.id
      const { role } = req.user.jwtToken
      if (role === 'admin') {
        const { id } = req.params
        const getUser = await User.findAll({ where: { id } })
        // console.log(getUser[0].email)
        if (getUser.length) {
          const schema = joi.object({
            name: joi.string().required(),
            birthdate: joi.date().required(),
            email: joi.string().email().required(),
            password: joi.string().required(),
            role: joi.string().required()
          })
          const { value, error } = schema.validate(req.body)
          const { name, birthdate, email, password, role } = value

          if (error) {
            res.send({
              success: false,
              message: `${error}`
            })
          } else {
            if (req.file === undefined) {
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
                    name, birthdate, email, password: hash, role, photo: ''
                  }
                  if (role === 'admin' || role === 'jurnalis' || role === 'user') {
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
                      message: 'Role does not match'
                    })
                  }
                } else {
                  res.send({
                    success: false,
                    message: 'Email already exists'
                  })
                }
              }
            } else {
              const photo = `uploads/${req.file.filename}`
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
                    name, birthdate, email, password: hash, role, photo: photo
                  }
                  if (role === 'admin' || role === 'jurnalis' || role === 'user') {
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
                      message: 'Role does not match'
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
        }
      } else {
        res.send({
          success: false,
          message: 'You are not admin'
        })
      }
    } catch (err) {
      res.send({
        success: false,
        message: `${err}`
      })
    }
  },

  updatePersonal: async (req, res) => {
    try {
      // const idFromJwt = req.user.jwtToken.id
      const { id } = req.user.jwtToken
      const getUser = await User.findAll({ where: { id } })
      // console.log(getUser[0].email)
      if (getUser.length) {
        const schema = joi.object({
          name: joi.string(),
          birthdate: joi.date(),
          email: joi.string().email()
          // password: joi.string()
        })
        const { value, error } = schema.validate(req.body)
        const { name, birthdate, email } = value

        if (error) {
          res.send({
            success: false,
            message: `${error}`
          })
        } else {
          if (req.file === undefined) {
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
                // const salt = bcrypt.genSaltSync(10)
                // const hash = bcrypt.hashSync(password, salt)
                const data = {
                  name, birthdate, email
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
                } else {
                  res.send({
                    success: false,
                    message: 'Fail to update'
                  })
                }
              } else {
                res.send({
                  success: false,
                  message: 'Email already exists'
                })
              }
            }
          } else {
            const photo = `uploads/${req.file.filename}`
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
                // const salt = bcrypt.genSaltSync(10)
                // const hash = bcrypt.hashSync(password, salt)
                const data = {
                  name, birthdate, email, photo: photo
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
      }
    } catch (err) {
      res.send({
        success: false,
        message: `${err}`
      })
    }
  },

  changePassword: async (req, res) => {
    try {
      const { id } = req.user.jwtToken
      const schema = joi.object({
        oldPassword: joi.string().required(),
        newPassword: joi.string().required()
      })
      const { value, error } = schema.validate(req.body)
      const { oldPassword, newPassword } = value
      if (error) {
        res.send({
          success: false,
          message: `${error}`
        })
      } else {
        const checkAccount = await User.findAll({ where: { id } })
        if (checkAccount.length > 0) {
          const comparePassword = bcrypt.compareSync(oldPassword, checkAccount[0].password)
          if (comparePassword) {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(newPassword, salt)
            const updatePassword = await User.update({ password: hash }, { where: { id } })
            if (updatePassword.length > 0) {
              res.send({
                success: true,
                message: 'Password has been change'
              })
            } else {
              res.send({
                success: false,
                message: 'Fail to change password'
              })
            }
          } else {
            res.send({
              success: false,
              message: 'Password invalid'
            })
          }
        } else {
          res.send({
            success: false,
            message: 'Account not found'
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

  deleteUser: async (req, res) => {
    try {
      const roleFromToken = req.user.jwtToken.role
      if (roleFromToken === 'admin') {
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
      } else {
        res.send({
          success: false,
          message: 'You are not admin'
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
