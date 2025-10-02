import { Transaction } from "sequelize";
import { db } from "../../models";
import crudService from "../crud.service";

export const crud = crudService(db.OrderItem);

export const removeOrderItemsByOrderId = async (
  orderId: number,
  options: { transaction?: Transaction } = {}
) => {
  const details = await db.OrderItem.destroy({
    where: { o_id: orderId },
    transaction: options.transaction,
  });

  return details;
};

export const removeOrderItemsById = async (
  id: number,
  options: { transaction?: Transaction } = {}
) => {
  const details = await db.OrderItem.destroy({
    where: { id: id },
    transaction: options.transaction,
  });

  return details;
};
