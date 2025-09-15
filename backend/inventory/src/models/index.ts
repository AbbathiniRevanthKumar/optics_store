import sequelize from "../config/db.config";
import Customer from "./customer/customer.model";
import Frame from "./inventory/Frame.model";
import Lens from "./inventory/Lens.model";
import SightDetails from "./inventory/Sight.model";
import Order from "./orders/order.model";
import OrderItem from "./orders/orderItem.model";

//associations
Lens.belongsTo(SightDetails, { foreignKey: "l_sight_id" });
SightDetails.hasMany(Lens, { foreignKey: "l_sight_id" });

Customer.hasMany(Order, { foreignKey: "c_id", onDelete: "CASCADE",as:"customer" });
Order.belongsTo(Customer, { foreignKey: "c_id",as:"customer" });
Order.hasMany(OrderItem, { foreignKey: "o_id", onDelete: "CASCADE",as:"order_items" });
OrderItem.belongsTo(Order, { foreignKey: "o_id",as:"order_items" });
Frame.hasMany(OrderItem, { foreignKey: "f_id",as:"frame" });
OrderItem.belongsTo(Frame, { foreignKey: "f_id",as:"frame" });
Lens.hasMany(OrderItem, { foreignKey: "l_id" ,as:"lens"});
OrderItem.belongsTo(Lens, { foreignKey: "l_id",as : "lens" });

const db = {
  sequelize,
  Frame,
  Lens,
  SightDetails,
  Customer,
  Order,
  OrderItem,
};

const connectDB = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("---------------Database Connected-------------------");
    await db.sequelize.sync({});
    console.log("---------------Database Synced----------------------");
  } catch (error) {
    console.log("Database Error : ", error);
  }
};

export { db, connectDB };
