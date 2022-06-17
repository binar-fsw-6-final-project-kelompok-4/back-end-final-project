'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trancsaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  trancsaction.init({
    product_id: DataTypes.INTEGER,
    buyer_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    offer: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'trancsaction',
  });
   trancsaction.belongsTo(models.users);
   trancsaction.belongsTo(models.product);
  return trancsaction;
};