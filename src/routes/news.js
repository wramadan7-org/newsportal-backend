const route = require('express').Router()
const uploads = require('../helpers/uploads')
const auth = require('../middleware/auth')

// import controller
const {
  createNews,
  getNews,
  getDetailNews,
  updateNews,
  deleteNews,
  getPersonalNews
} = require('../controllers/news')

route.post('/', auth, uploads, createNews)
route.get('/personal', auth, getPersonalNews)
route.patch('/:id', auth, uploads, updateNews)
route.delete('/:id', auth, deleteNews)
route.get('/', getNews)
route.get('/:id', getDetailNews)

module.exports = route
