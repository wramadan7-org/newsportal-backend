const { Category } = require('../models')
const { Op } = require('sequelize')
const joi = require('joi')

module.exports = {
  createCategory: async (req, res) => {
    try {
      const schema = joi.object({
        category: joi.string().required()
      })

      const { value, error } = schema.validate(req.body)
      const { category } = value
      if (error) {
        res.send({
          success: false,
          message: `${error}`
        })
      } else {
        const checkCategory = await Category.findAll({ where: { category: category } })
        if (!checkCategory.length) {
          const data = {
            category
          }
          // menambah category
          const results = await Category.create(data)
          if (results) {
            res.send({
              success: true,
              message: 'Category has been added',
              results
            })
          } else {
            res.send({
              success: false,
              message: 'Fail to add category'
            })
          }
        } else {
          res.send({
            success: false,
            message: 'Category already exists'
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

  getCategory: async (req, res) => {
    const { search } = req.query
    const searchValue = search || ''
    if (search) {
      const searchCategory = await Category.findAll({ where: { category: { [Op.like]: `%${searchValue}%` } } })
      if (searchCategory.length) {
        res.send({
          success: true,
          message: 'Your search data',
          results: searchCategory
        })
      } else {
        res.send({
          success: false,
          message: 'Data not found'
        })
      }
    } else {
      const results = await Category.findAll()
      if (results.length) {
        res.send({
          success: true,
          message: 'All category',
          results
        })
      } else {
        res.send({
          success: false,
          message: 'Dont have category'
        })
      }
    }
  },

  updateCategory: async (req, res) => {
    const { id } = req.params
    const checkData = await Category.findAll({ where: { id: id } })
    if (checkData.length) {
      const schema = joi.object({
        category: joi.string().required()
      })
      const { value, error } = schema.validate(req.body)
      const { category } = value
      if (error) {
        res.send({
          success: false,
          message: `${error}`
        })
      } else {
        const categoryFromDb = checkData[0].category
        if (category === categoryFromDb || category !== categoryFromDb) {
          // cek category yang tidak sama dengan category berdasarkan params itu sendiri
          const checkAnotherCatgeory = await Category.findAll({ where: { category: { [Op.ne]: categoryFromDb } } })
          const mapsCategory = checkAnotherCatgeory.map(o => {
            return o.category
          })
          //  mengecek apakah inputan category ada yg sama dengan category selain dari id itu sendiri
          const someCategory = mapsCategory.some(item => item === category)
          if (someCategory === false) {
            const data = {
              category
            }
            const updateCategory = await Category.update(data, { where: { id: id } })

            if (updateCategory.length > 0) {
              const getCategoryAfterUpdate = await Category.findAll({ where: { id: id } })
              if (getCategoryAfterUpdate.length) {
                res.send({
                  success: true,
                  message: 'Update successfully',
                  results: getCategoryAfterUpdate[0]
                })
              } else {
                res.send({
                  success: false,
                  message: 'Fail to update category'
                })
              }
            } else {
              res.send({
                success: false,
                message: 'Fail to update category'
              })
            }
          } else {
            res.send({
              success: false,
              message: 'Category already exists'
            })
          }
        } else {
          res.send({
            success: false,
            message: 'I dont understand'
          })
        }
      }
    } else {
      res.send({
        success: false,
        message: 'Data not found'
      })
    }
  },

  deleteCategory: async (req, res) => {
    const { id } = req.params
    // check data
    const checkData = await Category.findAll({ where: { id: id } })
    if (checkData.length > 0) {
      const deleteData = await Category.destroy({ where: { id: id } })
      if (deleteData) {
        res.send({
          success: true,
          message: 'Category has been deleted'
        })
      } else {
        res.send({
          success: false,
          message: 'Fail to delete'
        })
      }
    } else {
      res.send({
        success: false,
        message: 'Data not found'
      })
    }
  }
}
