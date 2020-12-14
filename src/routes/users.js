const route = require('express').Router()
const uploads = require('../helpers/uploadsProfile')
const auth = require('../middleware/auth')

// import controller
const { createUser, getUsers, getPersonal, updateUser, updatePersonal, deleteUser, changePassword } = require('../controllers/users')

// personal
route.patch('/personal/changePassword', auth, changePassword)
route.get('/personal', auth, getPersonal)
route.patch('/personal', auth, uploads, updatePersonal)
// admin
route.post('/', auth, uploads, createUser)
route.get('/', auth, getUsers)
route.patch('/:id', auth, uploads, updateUser)
route.delete('/:id', auth, deleteUser)

module.exports = route
