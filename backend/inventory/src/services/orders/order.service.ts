import { db } from "../../models";
import Customer from "../../models/customer/customer.model";
import Frame from "../../models/inventory/Frame.model";
import OrderItem from "../../models/orders/orderItem.model";
import crudService from "../crud.service";

export const crud = crudService(db.Order);

export const orderList = async () => {
  const details = await db.Order.findAll({
    where: { status: 1 },
    include: [
      { model: Customer, as: "customer", where: { status: 1 } },
      {
        model: OrderItem,
        as: "order_items",
        include: [
          { model: Frame, as: "frame", attributes: { exclude: ["f_qty"] } },
        ],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });

  return details;
};

export const orderListbyCustomerId = async (id: number) => {
  const details = await db.Order.findAll({
    where: { c_id: id, status: 1 },
    include: [
      { model: Customer, as: "customer" },
      {
        model: OrderItem,
        as: "order_items",
        include: [
          { model: Frame, as: "frame", attributes: { exclude: ["f_qty"] } },
        ],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });

  return details;
};

export const orderDetailsById = async (id: number) => {
  const details = await db.Order.findOne({
    where: { id: id, status: 1 },
    include: [
      { model: Customer, as: "customer" },
      {
        model: OrderItem,
        as: "order_items",
        include: [{ model: Frame, as: "frame" }],
      },
    ],
  });
  return details;
};
