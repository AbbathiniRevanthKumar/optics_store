import { DataTypes } from "sequelize";
import sequelize from "../../config/db.config";

const Frame = sequelize.define(
  "Frame",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    f_code: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
    },
    f_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    f_company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    f_size: {
      type: DataTypes.ENUM("small", "medium", "large"),
      allowNull: false,
    },
    f_model: {
      type: DataTypes.ENUM("full-frame", "half-frame", "frame-less"),
      allowNull: false,
    },
    f_material: {
      type: DataTypes.ENUM("metal", "fiber"),
      allowNull: false,
    },
    f_price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      allowNull: false,
    },
    f_qty: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    f_discount: {
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
    tableName: "frames",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["f_code"],
      },
      {
        unique: true,
        fields: ["f_company", "f_name", "f_size", "f_model", "f_material"],
        name: "unique_frame_spec",
      },
    ],
  }
);



export default Frame;
