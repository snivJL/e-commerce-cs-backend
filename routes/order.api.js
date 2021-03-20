const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth");
const validators = require("../middlewares/validation");
const { check } = require("express-validator");

/**
 * @route POST api/order/add
 * @description User can create order
 * @access Login required
 */
router.post(
  "/add",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  validators.validate([
    check("products")
      .isArray({ min: 1 })
      .withMessage("Product list is required"),
  ]),
  orderController.createOrder
);
/**
 * @route PUT api/order/:id
 * @description User can update order
 * @access Login required
 */
router.put(
  "/:id/update",
  authMiddleware.loginRequired,
  orderController.updateOrder
);
/**
 * @route GET api/order/login
 * @description User can see order detail
 * @access Login required
 */
router.get(
  "/:id",
  authMiddleware.loginRequired,
  orderController.getSingleOrder
);

/**
 * @route DELETE api/order/login
 * @description Admin can delete order
 * @access Login required
 */
router.delete(
  "/:id/delete",
  authMiddleware.loginRequired,
  orderController.deleteOrder
);

module.exports = router;
