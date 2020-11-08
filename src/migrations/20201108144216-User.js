'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'photo', {
      type: Sequelize.TEXT
    })
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.ENUM('admin', 'jurnalis', 'user')
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'photo')
    await queryInterface.removeColumn('Users', 'role')
  }
}
