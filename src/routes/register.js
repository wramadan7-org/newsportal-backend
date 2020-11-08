const route = require('express').Router()
const { register } = require('../controllers/register')
route.post('/', register)

module.exports = route
