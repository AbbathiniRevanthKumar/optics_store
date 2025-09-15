import { DataTypes } from "sequelize";
import sequelize from "../../config/db.config";

const SightDetails = sequelize.define(
  "SightDetails",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    spherical: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    cylinder: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    addition: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
  },
  {
    tableName: "sight_details",
    timestamps: true,
  }
);

export default SightDetails;
