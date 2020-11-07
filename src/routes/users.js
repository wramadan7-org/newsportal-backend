const route = require('express').Router()

// import controller
const { createUser, getUsers, updateUser, deleteUser } = require('../controllers/admin/users')

// routing
route.post('/', createUser)
route.get('/', getUsers)
route.patch('/:id', updateUser)
route.delete('/:id', deleteUser)

module.exports = route
