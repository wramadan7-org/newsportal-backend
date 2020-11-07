const route = require('express').Router()

// import controller
const { createCategory, getCategory, updateCategory, deleteCategory } = require('../controllers/categories')

// routing
route.post('/', createCategory)
route.get('/', getCategory)
route.patch('/:id', updateCategory)
route.delete('/:id', deleteCategory)

module.exports = route
