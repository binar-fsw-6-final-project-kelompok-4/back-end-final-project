/**
 * @file Manages database connection configuration.
 * @author Kelompok 4
 */

/** Destruct environment variable to get database configuration */
const path = require("path");
require("dotenv").config(__dirname + "/../.env");

const DB_TEST_FILE_PATH = path.join(__dirname, "../db/test.sqlite");
const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME
} = process.env;

module.exports = {
  // Elephant SQL
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
    ssl: true,
  },
  // SQLite
  test: {
    storage: DB_TEST_FILE_PATH,
    logging: false,
    dialect: "sqlite",
  },
  // Heroku Postgres
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};