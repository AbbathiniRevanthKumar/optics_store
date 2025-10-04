import { Router } from "express";
import * as customerController from "../../controllers/customer/customer.controller";
import authorizeRole from "../../middlewares/authorize.handler";
const router = Router();

router.post(
  "/add",
  authorizeRole(["admin", "super-admin"]),
  customerController.createCustomer
);


router.get(
  "/all",
  authorizeRole(["admin", "super-admin","user"]),
  customerController.allCustomers
);

router.put(
  "/delete/:id",
  authorizeRole(["admin", "super-admin"]),
  customerController.deleteCustomerById
);

export default router;