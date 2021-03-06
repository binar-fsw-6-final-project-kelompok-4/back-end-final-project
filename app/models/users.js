'use strict';

module.exports = (sequelize, DataTypes) => {
  const {
    Model
  } = sequelize.Sequelize
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.trancsaction, {
        foreignKey: 'buyer_id'
      })
      this.hasMany(models.product, {
        foreignKey: 'seller_id'
      },
      {through : "user_product"})
    }
  }
  users.init({
    token: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    contact: DataTypes.STRING,
    city: DataTypes.STRING,
    profile_img: DataTypes.STRING,
    role_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users',
  });
// <<<<<<< HEAD
//     users.associate = function (models){
//       users.hasMany(models.trancsaction, { foreignKey: 'buyer_id'})
//       users.hasMany(models.product, { foreignKey: 'seller_id'})
//       users.hasMany(models.whislist, { foreignKey: 'user_id'})
//     }
// =======
//   users.associate = function (models) {
//     users.hasMany(models.trancsaction, {
//       foreignKey: 'buyer_id'
//     })
//     users.hasMany(models.product, {
//       foreignKey: 'seller_id'
//     })
//   }
  // users.associate = function (models){
  //   users.hasMany(models.trancsaction, { foreignKey: 'buyer_id'})
  //   users.hasMany(models.product, { foreignKey: 'seller_id'})
  // }
  return users;
};