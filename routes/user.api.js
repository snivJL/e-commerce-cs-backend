const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth");

/**
 * @route POST api/user
 * @description Register new user
 * @access Public
 */
router.post("/", userController.register);

/**
 * @route GET api/user/me
 * @description Return current user info
 * @access Login required
 */
router.get("/me", authMiddleware.loginRequired, userController.getCurrentUser);

/**
 * @route GET api/user/me
 * @description Return current user info
 * @access Admin required
 */
router.get(
  "/",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  userController.getAllUsers
);

/**
 * @route GET api/user/:id/order
 * @description Return list orders of current user
 * @access Login Required or Admin authorized
 */
router.get(
  "/:id/order",
  authMiddleware.loginRequired,
  userController.getUserOrders
);

/**
 * @route Put api/user/:id/payment
 * @description User can make payment
 * @access Login required
 */
router.put(
  "/:id/payment",
  authMiddleware.loginRequired,
  userController.makePayment
);

/**
 * @route PUT api/user/:id/topup
 * @description Top-up user balance
 * @access Admin requied
 */
router.put(
  "/:id/topup",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  userController.topup
);

module.exports = router;
