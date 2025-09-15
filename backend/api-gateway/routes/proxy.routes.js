const router = require("express").Router();
const { authProxy } = require("../services/auth.service");
const { authenticate } = require("../middleware/authencticate.handler");
const { inventoryProxy, customerProxy, ordersProxy } = require("../services/inventory.service");

router.use("/auth", authProxy);
router.use("/inventory", authenticate, inventoryProxy);
router.use("/customer", authenticate, customerProxy);
router.use("/orders", authenticate, ordersProxy);

module.exports = router;
