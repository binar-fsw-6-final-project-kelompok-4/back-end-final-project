/**
 * @file contains entry point of controllers api v1 module
 * @author Kelompok 4
 */

const post = require("./post");
const userController = require("./userController");
const productController = require("./productController")

module.exports = {
  userController,
  productController,
  post,
};