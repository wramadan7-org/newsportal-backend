const route = require('express').Router()
const uploads = require('../helpers/uploads')

// import controller
const { createNews, getNews, updateNews, deleteNews } = require('../controllers/news')

route.post('/', uploads, createNews)
route.get('/', getNews)
route.patch('/:id', updateNews)
route.delete('/:id', deleteNews)

module.exports = route
