const { Sequelize } = require("sequelize");
const { consts } = require("../config/config");

const sequelize = new Sequelize(
  consts.pg_db,
  consts.pg_username,
  consts.pg_password,
  {
    host: consts.pg_host,
    port: consts.pg_port,
    dialect: consts.db_dialect,
    logging: consts.app_env === "PROD" ? false : console.log,
  }
);


module.exports = sequelize;