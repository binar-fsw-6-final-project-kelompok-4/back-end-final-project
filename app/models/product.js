'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product.init({
    product_name: DataTypes.STRING,
    seller_id: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    category: DataTypes.STRING,
    description: DataTypes.STRING,
    product_img1: DataTypes.STRING,
    product_img2: DataTypes.STRING,
    product_img3: DataTypes.STRING,
    product_img4: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};