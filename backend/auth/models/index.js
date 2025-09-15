const sequelize = require("../config/db.config");
const User = require("./user/user.model");

const db = {
  sequelize,
  User
};

const connect = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("---------------Database Connected-------------------");
    await db.sequelize.sync({});
    console.log("---------------Database Synced----------------------");
  } catch (error) {
    console.log("Database Error : ", error);
  }
};


module.exports = {db,connect};