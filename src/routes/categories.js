const route = require('express').Router()
const auth = require('../middleware/auth')

// import controller
const { createCategory, getCategory, updateCategory, deleteCategory } = require('../controllers/categories')

// routing
route.post('/', auth, createCategory)
route.get('/', getCategory)
route.patch('/:id', auth, updateCategory)
route.delete('/:id', auth, deleteCategory)

module.exports = route
