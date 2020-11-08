'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('News', 'category', { type: Sequelize.STRING })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('News', 'category')
  }
}
