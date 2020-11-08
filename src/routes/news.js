const route = require('express').Router()
const uploads = require('../helpers/uploads')
const auth = require('../middleware/auth')

// import controller
const { createNews, getNews, updateNews, deleteNews } = require('../controllers/news')

route.post('/', auth, uploads, createNews)
route.get('/', getNews)
route.patch('/:id', auth, uploads, updateNews)
route.delete('/:id', auth, deleteNews)

module.exports = route
