import { DataTypes } from "sequelize";
import sequelize from "../../config/db.config";
import Frame from "../inventory/Frame.model";
import Lens from "../inventory/Lens.model";
import Order from "./order.model";

const OrderItem = sequelize.define(
  "order_item",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    o_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Order,
        key: "id",
      },
    },
    f_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: Frame,
        key: "id",
      },
    },
    l_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: Lens,
        key: "id",
      },
    },
    p_qty : {
      type : DataTypes.INTEGER,
      allowNull : false,
      defaultValue:0
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default OrderItem;
