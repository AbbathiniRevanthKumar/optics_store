import { db } from "../../models";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/async.handler";
import { orderDetails } from "../../types/orders.types";
import ApiResponseHandler, { ApiError } from "../../utils/response.handler";
import * as customerService from "../../services/customer/customer.service";
import * as frameService from "../../services/inventory/Frame.service";
import * as ordersService from "../../services/orders/order.service";
import * as orderItemsService from "../../services/orders/orderItems.service";

const checkCustomerDetails = async (customerId: number, transaction?: any) => {
  return customerService.crud.getById(customerId, { transaction: transaction });
};

const checkOrderItems = async (orderItems: any, transaction: any) => {
  if (!orderItems || orderItems.length === 0) return null;

  const checkPromises = orderItems.map(async (item: any) => {
    if (item.type === "frames") {
      const itemDetails: any = await frameService.crud.getById(item.id, {
        transaction,
      });
      if (!itemDetails || itemDetails.f_qty < item.quantity)
        throw new Error("Items with required quantity not found in inventory");
      return itemDetails;
    }
  });

  const productsDetails = await Promise.all(checkPromises);
  return productsDetails;
};

const processInventoryQty = async (details: any) => {
  const { order_items, productDetails, transaction } = details;

  const processPromises = order_items.map(async (orderItem: any) => {
    const itemInInventory = productDetails.find(
      (item: any) => item.id === orderItem.id
    );
    if (orderItem.type === "frames") {
      const qty = itemInInventory.f_qty - orderItem.quantity;
      if (qty < 0) return itemInInventory;
      const updatedItem = await frameService.crud.update(
        orderItem.id,
        { f_qty: qty },
        { transaction }
      );
      return updatedItem;
    }
    return itemInInventory;
  });

  return await Promise.all(processPromises);
};

const processOrderItems = async (details: any) => {
  const { order_items, orderDetails, transaction } = details;

  const processPromises = order_items.map(async (item: any) => {
    const order_item_body = {
      o_id: orderDetails.id,
      f_id: null,
      l_id: null,
      p_qty: item.quantity,
    };
    if (item.type === "frames") {
      order_item_body.f_id = item.id;
    } else {
      order_item_body.l_id = item.id;
    }

    const orderItemDetails = await orderItemsService.crud.create(
      order_item_body,
      { transaction }
    );
    return orderItemDetails;
  });

  const orderItemDetails = await Promise.all(processPromises);
  return orderItemDetails;
};

const processOrder = async (details: any) => {
  const { order_details, transaction } = details;

  //check the ordered_items in inventory
  const productDetails = await checkOrderItems(
    order_details.order_items,
    transaction
  );

  //add the order
  const order_body = {
    c_id: order_details.c_id,
    o_status: order_details.o_status || "pending",
    o_delivery_date: order_details.o_delivery_date,
    o_order_date: order_details.o_order_date,
    o_notes: order_details.o_notes || "",
  };

  const orderDetails = await ordersService.crud.create(order_body, {
    transaction,
  });

  //add the order_items
  const orderItemDetails = await processOrderItems({
    order_items: order_details.order_items,
    orderDetails,
    transaction,
  });

  //descrease the ordered_item in inventory
  const updatedProductDetails = await processInventoryQty({
    order_items: order_details.order_items,
    productDetails,
    transaction,
  });
  return { orderDetails, orderItemDetails, updatedProductDetails };
};

export const createOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const order_details: orderDetails = req.body;
    //validation
    if (
      !order_details.c_id ||
      !order_details.order_items ||
      !order_details.o_order_date ||
      !order_details.o_delivery_date
    ) {
      throw new ApiError("Please provide required details", 400);
    }

    //start the transaction
    const transaction = await db.sequelize.transaction();

    try {
      //check the customer details
      const customerDetails = await checkCustomerDetails(
        order_details.c_id,
        transaction
      );
      if (!customerDetails) throw new Error("Customer not found");

      //process the order
      const orderDetails = await processOrder({ order_details, transaction });
      await transaction.commit();
      return ApiResponseHandler.success(
        res,
        "order created",
        orderDetails,
        201
      );
    } catch (error: any) {
      //rollback
      await transaction.rollback();
      throw new ApiError(
        error.message || "Error at creating order",
        error.message ? 400 : 500
      );
    }
  }
);

const processItemsToRemove = async (details: any) => {
  const { items, transaction } = details;

  if (items.length === 0) return;

  const processPromises = items.map(async (item: any) => {
    //process order items
    if (item.oldQty) {
      const updatedOrderItem = await orderItemsService.crud.update(
        item.orderItemId,
        { p_qty: item.quantity },
        { transaction }
      );
    } else {
      const updatedOrderItem = await orderItemsService.removeOrderItemsById(
        item.orderItemId,
        {
          transaction,
        }
      );
    }
    //increase the inventory
    if (item.type === "frames") {
      const updatedInventoryItem = await frameService.crud.update(
        item.id,
        { f_qty: item.inventoryQty },
        { transaction }
      );
    }
  });

  await Promise.all(processPromises);

  return;
};

export const updateOrderByOrderId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const order_details: orderDetails = req.body;

    //1. Validation
    if (
      !id ||
      !order_details.c_id ||
      !order_details.order_items ||
      !order_details.o_order_date ||
      !order_details.o_delivery_date
    ) {
      throw new ApiError("Please provide required details", 400);
    }

    //2. Start Transaction
    const transaction = await db.sequelize.transaction();

    try {
      //3. Get existing order details
      const oldOrderDetails: any = await ordersService.orderDetailsById(
        Number(id)
      );

      if (!oldOrderDetails) {
        throw new Error("Order details not found!");
      }

      const oldOrderItems = oldOrderDetails.order_items;

      const filteredItems: any = {
        add: [], // new items or qty increased
        remove: [], // items removed or qty decreased
      };

      // 4. Compare old vs new items (Detect increased qty or new items)
      order_details.order_items.forEach((orderItem: any) => {
        const oldItem = oldOrderItems.find(
          (item: any) =>
            orderItem.id === item.f_id || orderItem.id === item.l_id
        );

        if (!oldItem) {
          // completely new item
          filteredItems.add.push(orderItem);
          return;
        }

        const newQty = orderItem.quantity;
        const oldQty = oldItem.p_qty;
        const qtyDiff = newQty - oldQty;

        if (qtyDiff > 0) {
          // qty increased → deduct diff from inventory, update order item qty
          orderItem.oldQty = oldQty;
          orderItem.checkQty = qtyDiff;
          orderItem.orderItemId = oldItem.id;
          filteredItems.add.push(orderItem);
        } else if (qtyDiff < 0) {
          // qty decreased → add diff back to inventory, update order item qty
          orderItem.oldQty = oldQty;
          orderItem.orderItemId = oldItem.id;
          if (orderItem.type === "frames") {
            orderItem.inventoryQty = oldItem.frame.f_qty + (oldQty - newQty);
          }
          filteredItems.remove.push(orderItem);
        }
      });

      // 5. Detect items completely removed in new list
      oldOrderItems.forEach((oldItem: any) => {
        const itemStillExists = order_details.order_items.find(
          (orderItem: any) =>
            orderItem.id === oldItem.f_id || orderItem.id === oldItem.l_id
        );
        if (!itemStillExists) {
          const item: any = {
            orderItemId: oldItem.id,
            id: oldItem.f_id || oldItem.l_id,
            quantity: oldItem.p_qty,
            type: oldItem.f_id ? "frames" : "lens",
          };
          if (item.type === "frames") {
            item.inventoryQty = oldItem.frame.f_qty + oldItem.p_qty;
          }
          filteredItems.remove.push(item);
        }
      });

      //6. Process items to remove (qty decrease or complete removal)
      if (filteredItems.remove.length > 0) {
        await processItemsToRemove({
          items: filteredItems.remove,
          transaction,
        });
      }

      // 7. Process items to add or increase qty
      if (filteredItems.add.length > 0) {
        // check inventory for new additions or qty increases
        const productDetails = await checkOrderItems(
          filteredItems.add.map((i: any) => ({
            ...i,
            quantity: i.checkQty || i.quantity,
          })),
          transaction
        );

        // decrease the ordered qty from inventory
        await processInventoryQty({
          order_items: filteredItems.add.map((i: any) => ({
            ...i,
            quantity: i.checkQty || i.quantity,
          })),
          productDetails,
          transaction,
        });

        // if it's a new item (no oldQty), insert into order_items table
        // if qty increased, update existing order_item record
        for (const item of filteredItems.add) {
          if (item.oldQty) {
            // qty increased → update existing record
            await orderItemsService.crud.update(
              item.orderItemId,
              { p_qty: item.quantity },
              { transaction }
            );
          } else {
            // new item → insert new record
            const order_item_body = {
              o_id: Number(id),
              f_id: item.type === "frames" ? item.id : null,
              l_id: item.type === "lens" ? item.id : null,
              p_qty: item.quantity,
            };
            await orderItemsService.crud.create(order_item_body, {
              transaction,
            });
          }
        }
      }

      //8. Update main order details
      await ordersService.crud.update(
        Number(id),
        {
          c_id: order_details.c_id,
          o_status: order_details.o_status || oldOrderDetails.o_status,
          o_order_date: order_details.o_order_date,
          o_delivery_date: order_details.o_delivery_date,
          o_notes: order_details.o_notes || oldOrderDetails.o_notes,
        },
        { transaction }
      );

      // 9. Commit transaction
      await transaction.commit();

      return ApiResponseHandler.success(
        res,
        "Order updated",
        order_details,
        200
      );
    } catch (error: any) {
      // 10. Rollback on failure
      await transaction.rollback();
      throw new ApiError(
        typeof error === "string"
          ? error
          : error.message || "Error updating order",
        typeof error === "string" ? 400 : 500
      );
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

export const deleteOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: order_id } = req.params;

    const order_details: any = await ordersService.orderDetailsById(
      Number(order_id)
    );
    if (!order_details) {
      throw new ApiError("No orders found!", 400);
    }

    if (order_details.o_status === "completed") {
      throw new ApiError("cannot delete completed orders!", 400);
    }

    const transaction = await db.sequelize.transaction();
    try {
      //increment the stock in inventory of old details
      const incrementStocks = order_details.order_items.map(
        async (item: any) => {
          const type = item.f_id ? "frames" : "lens";
          let newQty = 0;
          let id = null;
          if (type === "frames") {
            newQty = item.frame.f_qty + item.p_qty;
            id = item.f_id;
            const updatedInventoryItem = await frameService.crud.update(id,{f_qty : newQty},{transaction});
          }
        }
      );
      await Promise.all(incrementStocks);

      const deletedOrderDetails = await ordersService.crud.remove(
        Number(order_id),
        {
          transaction,
        }
      );
      await transaction.commit();
      return ApiResponseHandler.success(
        res,
        "Order deleted",
        deletedOrderDetails,
        200
      );
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }
);
