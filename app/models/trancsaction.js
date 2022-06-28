'use strict';
module.exports = (sequelize, DataTypes) => {
  const { Model } = sequelize.Sequelize
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
    seller_id: DataTypes.INTEGER,
    buyer_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    offer: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'trancsaction',
  });
  trancsaction.associate = function (models){
    trancsaction.belongsTo(models.product,{ foreignKey: 'id'})
    trancsaction.belongsTo(models.users,{ foreignKey: 'id'})
  }
  return trancsaction;
};