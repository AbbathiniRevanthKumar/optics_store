import { Router } from "express";
import * as orderController from "../../controllers/orders/orders.controller";
import authorizeRole from "../../middlewares/authorize.handler";
const router = Router();

router.post(
  "/add",
  authorizeRole(["admin", "super-admin"]),
  orderController.createOrder
);

router.get(
  "/allOrders",
  authorizeRole(["admin", "super-admin", "user"]),
  orderController.ordersDetailsList
);

router.get(
  "/customerOrders/:id",
  authorizeRole(["admin", "super-admin", "user"]),
  orderController.ordersDetailsListByCustomerId
);

export default router;
