
/* eslint-disable no-unused-vars */
const multer = require("multer");
const path = require("path");

// Mendefinisikan gimana cara nyimpen file-nya
console.log("masuk sini============")
const storage = multer.memoryStorage();

// Membuat upload middleware
module.exports = multer({storage});