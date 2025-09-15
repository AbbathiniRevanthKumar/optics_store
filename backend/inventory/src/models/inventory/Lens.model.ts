import { DataTypes } from "sequelize";
import sequelize from "../../config/db.config";

const Lens = sequelize.define(
  "Lens",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    l_code: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
    },
    l_company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    l_sight_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    l_material: {
      type: DataTypes.ENUM("fiber", "glass"),
      allowNull: false,
    },
    l_type: {
      type: DataTypes.ENUM("single", "bifocal", "progressive"),
      allowNull: false,
    },
    l_coated: {
      type: DataTypes.ENUM("hmc", "white", "bluecut"),
      allowNull: false,
    },
    l_price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      allowNull: false,
    },
    l_qty: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    l_discount: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.0,
      allowNull: false,
    },
    status: {
      type: DataTypes.SMALLINT,
      defaultValue: 1,
    },
  },
  {
    tableName: "lenses",
    timestamps: true,
  }
);

export default Lens;
