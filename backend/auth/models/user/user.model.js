const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.config");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement:true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role : {
        type : DataTypes.ENUM("admin","user"),
        allowNull : false,
        defaultValue : "user"
    },
    status : {
        type : DataTypes.INTEGER,
        allowNull:false,
        defaultValue : 1
    },
    auth_type : {
      type : DataTypes.STRING,
      allowNull : false,
      defaultValue : "auth"
    }
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;
