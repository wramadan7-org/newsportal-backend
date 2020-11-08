'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('News', 'image', {
      type: Sequelize.TEXT
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('News', 'image')
  }
}
