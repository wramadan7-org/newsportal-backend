'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      User.hasMany(models.News, { foreignKey: 'author_id' })
    }
  };
  User.init({
    name: DataTypes.STRING,
    birthdate: DataTypes.DATEONLY,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    photo: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'User'
  })
  return User
}
