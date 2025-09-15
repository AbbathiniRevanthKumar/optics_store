import { Router } from "express";
import authenticate from "../../middlewares/authenticate";

import * as inventoryController from "../../controllers/inventory/inventory.controller";
import authorizeRole from "../../middlewares/authorize.handler";

const router = Router();

router.post(
  "/create/:type",
  authorizeRole(["admin", "super-admin"]),
  inventoryController.createInventory
);
router.get("/products/:type", inventoryController.getTotalInventory);
router.get("/product/:type/:id", inventoryController.getProductById);
router.put(
  "/product/:type/:id",
  authorizeRole(["admin", "super-admin"]),
  inventoryController.updateProduct
);
router.patch(
  "/product/:type/:id",
  authorizeRole(["admin", "super-admin"]),
  inventoryController.removeProduct
);

export default router;
