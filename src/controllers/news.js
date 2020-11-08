const { News } = require('../models')
const { Op } = require('sequelize')
const joi = require('joi')

module.exports = {
  createNews: async (req, res) => {
    try {
      // const image = req.file
      console.log(req.file)
      const schema = joi.object({
        title: joi.string().required(),
        news: joi.string().required(),
        category: joi.string().required()
      })
      const { value, error } = schema.validate(req.body)
      const { title, news, category } = value
      if (error) {
        res.send({
          success: false,
          message: `${error}`
        })
      } else {
        if (req.file === undefined) {
          const checkNews = await News.findAll({ where: { title: title } })
          if (checkNews.length > 0) {
            res.send({
              success: false,
              message: 'News alreadey exists'
            })
          } else {
            const data = {
              title, news, category
            }
            const results = await News.create(data)
            if (results) {
              res.send({
                success: true,
                message: 'Success add news',
                results
              })
            } else {
              res.send({
                success: false,
                message: 'Fail to add news'
              })
            }
          }
        } else {
          const image = `uploads/${req.file.filename}` // ambil filename dari helpers yang sudah di edit
          const checkNews = await News.findAll({ where: { title: title } })
          if (checkNews.length > 0) {
            res.send({
              success: false,
              message: 'News alreadey exists'
            })
          } else {
            const data = {
              title, news, category, image: image
            }
            const results = await News.create(data)
            if (results) {
              res.send({
                success: true,
                message: 'Success add news',
                results
              })
            } else {
              res.send({
                success: false,
                message: 'Fail to add news'
              })
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

  getNews: async (req, res) => {
    try {
      const { search } = req.query
      const searchValue = search || ''
      if (search) {
        const searchNews = await News.findAll({ where: { title: { [Op.like]: `%${searchValue}%` } } })
        if (searchNews.length) {
          res.send({
            success: true,
            message: 'Your search',
            results: searchNews
          })
        } else {
          res.send({
            success: false,
            message: 'Data not found'
          })
        }
      } else {
        const getAllNews = await News.findAll()
        console.log(getAllNews.length)
        if (getAllNews.length) {
          res.send({
            success: true,
            message: 'All news',
            results: getAllNews
          })
        } else {
          res.send({
            success: false,
            message: 'Dont have news'
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

  updateNews: async (req, res) => {
    try {
      const { id } = req.params

      const checkNews = await News.findAll({ where: { id: id } })
      if (checkNews.length) {
        const schema = joi.object({
          title: joi.string().required(),
          news: joi.string().required(),
          category: joi.string().required()
        })
        const { value, error } = schema.validate(req.body)
        const { title, news, category } = value
        if (error) {
          res.send({
            success: false,
            message: `${error}`
          })
        } else {
          const getTitileFromDb = checkNews[0].title
          if (title === getTitileFromDb || title !== getTitileFromDb) {
            const findAnotherTitle = await News.findAll({ where: { title: { [Op.ne]: getTitileFromDb } } })
            const mapsTitleAnother = findAnotherTitle.map(o => {
              return o.title
            })
            console.log('maps', mapsTitleAnother)
            const someNews = await mapsTitleAnother.some(item => item === title)
            if (someNews === true) {
              res.send({
                success: false,
                message: 'News already exists'
              })
            } else {
              const data = {
                title, news, category
              }
              const updateNews = await News.update(data, { where: { id: id } })
              if (updateNews.length > 0) {
                const getNewsAfterUpdate = await News.findAll({ where: { id: id } })
                if (getNewsAfterUpdate.length) {
                  res.send({
                    success: true,
                    message: 'Updated succrssfully',
                    results: getNewsAfterUpdate[0]
                  })
                }
              }
            }
          }
        }
      } else {
        res.send({
          success: false,
          message: 'Data not found'
        })
      }
    } catch (err) {
      res.send({
        success: false,
        message: `${err}`
      })
    }
  },

  deleteNews: async (req, res) => {
    try {
      const { id } = req.params
      const checkNews = await News.findAll({ where: { id: id } })
      if (checkNews.length > 0) {
        const deleteNews = await News.destroy({ where: { id: id } })
        if (deleteNews) {
          res.send({
            success: true,
            message: 'Delete successfully'
          })
        } else {
          res.send({
            success: false,
            message: 'Fail to delete news'
          })
        }
      } else {
        res.send({
          success: false,
          message: 'News not found'
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
