/**
 * @file Manages database connection configuration.
 * @author Kelompok 4
 */

/** Destruct environment variable to get database configuration */
const {
  DB_USERNAME = "postgres", DB_PASSWORD = "adrian", DB_HOST = "localhost", DB_NAME = "final_project"
} = process.env;

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: "postgres",
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: `${DB_NAME}_test`,
    host: DB_HOST,
    dialect: "postgres",
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: `${DB_NAME}_production`,
    host: DB_HOST,
    dialect: "postgres",
  },
};