const route = require('express').Router()

const { login } = require('../controllers/login')

route.post('/', login)

module.exports = route
