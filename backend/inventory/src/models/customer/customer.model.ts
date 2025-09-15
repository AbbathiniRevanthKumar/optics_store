import { DataTypes } from "sequelize";
import sequelize from "../../config/db.config";

const Customer = sequelize.define(
  "customer",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    c_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    c_email: {
      type: DataTypes.STRING(155),
      allowNull: true,
    },
    c_mobile_number: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    c_dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    c_place: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    indexes: [
      {
        unique: true,
        fields: ["c_name", "c_mobile_number"],
        name: "unique_customer",
      },
    ],
  }
);


export default Customer;