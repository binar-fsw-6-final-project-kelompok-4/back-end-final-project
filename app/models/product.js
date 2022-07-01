'use strict';

module.exports = (sequelize, DataTypes) => {
  const { Model } = sequelize.Sequelize
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.trancsaction, { foreignKey: 'product_id'})
      this.belongsTo(models.users,{ foreignKey: 'id'})
    }
  }
  product.init({
    product_name: DataTypes.STRING,
    seller_id: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    category: DataTypes.STRING,
    available: DataTypes.BOOLEAN,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'product',
  });
  // product.associate = function (models){
  //   product.hasOne(models.trancsaction, { foreignKey: 'product_id'})
  //   product.hasMany(models.users,{ foreignKey: 'id'})
  // }
  return product;
};