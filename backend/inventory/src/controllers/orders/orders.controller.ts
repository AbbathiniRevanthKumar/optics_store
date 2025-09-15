import { db } from "../../models";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/async.handler";
import { orderDetails } from "../../types/orders.types";
import ApiResponseHandler, { ApiError } from "../../utils/response.handler";
import * as customerService from "../../services/customer/customer.service";
import * as frameService from "../../services/inventory/Frame.service";
import * as ordersService from "../../services/orders/order.service";
import * as orderItemsService from "../../services/orders/orderItems.service";

const checkItemInInventory = async (
  itemId: number,
  type: "frames",
  transaction?: any
) => {
  if (type === "frames") {
    const itemDetails = await frameService.crud.getById(itemId, {
      transaction,
    });
    return itemDetails;
  }
  return;
};

const checkQty = (itemDetails: any, reqQty: number, type: "frames") => {
  if (type === "frames") {
    return itemDetails.f_qty >= reqQty;
  }
  return;
};

const decreaseQtyInInventory = async (
  itemDetail: any,
  item: any,
  transaction?: any
) => {
  if (item.type === "frames") {
    const newQty = itemDetail.f_qty - item.quantity;
    const updatedItem = await frameService.crud.update(
      itemDetail.id,
      { f_qty: newQty },
      { transaction }
    );
    return updatedItem;
  }
};

const addItems = async (item: any, orderId: number, transaction?: any) => {
  if (item.type === "frames") {
    const orderItemBody = {
      o_id: orderId,
      f_id: item.id,
      p_qty: item.quantity,
      l_id: null,
    };
    const orderItem = await orderItemsService.crud.create(orderItemBody, {
      transaction,
    });
    return orderItem;
  }
};

export const createOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderDetails: orderDetails = req.body;

    if (
      !orderDetails?.c_id ||
      !orderDetails?.order_items ||
      !orderDetails?.o_delivery_date ||
      !orderDetails?.o_order_date 
    ) {
      throw new ApiError(
        "Please provide required details to create an order",
        400
      );
    }

    // start transaction
    const transaction = await db.sequelize.transaction();

    try {
      // check customer exists
      const isCustomerExists = await customerService.crud.getById(
        orderDetails.c_id,
        { transaction }
      );
      if (!isCustomerExists) {
        throw new ApiError("Customer not exists", 400);
      }

      // check inventory
      const checkProducts = orderDetails.order_items.map(async (item: any) => {
        const itemId = item.id || null;
        const type = item.type;
        const itemDetails = await checkItemInInventory(
          itemId,
          type,
          transaction
        );
        if (!itemDetails || !checkQty(itemDetails, item.quantity, type)) {
          throw new ApiError("Required inventory does not exist", 400);
        }
        return itemDetails;
      });
      const productsDetails = await Promise.all(checkProducts);

      // create order
      const orderBody = {
        c_id: orderDetails.c_id,
        o_status: orderDetails.o_status || "progress",
        o_delivery_date: orderDetails.o_delivery_date,
        o_order_date : orderDetails.o_order_date,
        o_notes : orderDetails.o_notes || "",
      };

      const newOrder: any = await ordersService.crud.create(orderBody, {
        transaction,
      });

      // insert items + decrease stock
      const processOrderItemsPromises = orderDetails.order_items.map(
        async (item: any) => {
          const orderItem = await addItems(item, newOrder.id, transaction);

          const itemDetail = productsDetails.find((inventoryItem) => {
            return inventoryItem.id == item.id;
          });

          if (!itemDetail) {
            throw new ApiError(
              "Inventory item not found while processing order",
              400
            );
          }

          await decreaseQtyInInventory(itemDetail, item, transaction);

          return orderItem;
        }
      );
      const processedOrderItems = await Promise.all(processOrderItemsPromises);

      // commit transaction
      await transaction.commit();

      const newOrderDetails = {
        order_details: newOrder,
        order_items: processedOrderItems,
      };

      return ApiResponseHandler.success(
        res,
        "Order added",
        newOrderDetails,
        201
      );
    } catch (error) {
      // rollback if anything fails
      await transaction.rollback();
      next(error);
    }
  }
);

export const ordersDetailsList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const details = await ordersService.orderList();

    return ApiResponseHandler.success(res, "orders List", details, 200);
  }
);

export const ordersDetailsListByCustomerId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError("Provide customer id", 400);
    }
    const details = await ordersService.orderListbyCustomerId(Number(id));

    return ApiResponseHandler.success(res, "orders List", details, 200);
  }
);

