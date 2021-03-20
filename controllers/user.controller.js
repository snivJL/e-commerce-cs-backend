const utilsHelper = require("../helpers/utils.helper");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Order = require("../models/Order");
const { Error } = require("mongoose");
const userController = {};

userController.register = async (req, res, next) => {
  try {
    let { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return next(new Error("401 - User already exists"));

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user = await User.create({ name, password, email, role });

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user },
      null,
      "User account created"
    );
  } catch (error) {
    next(error);
  }
};

userController.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) return next(new Error("401 - User not found"));

    utilsHelper.sendResponse(res, 200, true, { user }, null, "Current user");
  } catch (error) {
    next(error);
  }
};

userController.getUserOrders = async (req, res, next) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ userId, isDeleted: false })
      .populate("userId")
      .populate("products")
      .sort({ createdAt: -1 });

    utilsHelper.sendResponse(res, 200, true, { orders }, null, "Current user");
  } catch (error) {
    next(error);
  }
};

userController.getAllUsers = async (req, res, next) => {
  try {
    const userId = req.userId;
    const users = await User.find({});

    utilsHelper.sendResponse(res, 200, true, { users }, null, "USer List");
  } catch (error) {
    next(error);
  }
};

userController.topup = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const topup = req.body.topup;
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $inc: { balance: topup },
      },
      { new: true }
    );

    console.log(user);

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user },
      null,
      "Balance updated!"
    );
  } catch (error) {
    next(error);
  }
};

userController.makePayment = async (req, res, next) => {
  const { orderId } = req.body;
  const userId = req.params.id;

  if (!orderId) return next(new Error("401 - product not found in body"));

  try {
    const price = await Order.findById({ _id: orderId });

    const user = await User.findById({ _id: userId });
    if (!user) return next(new Error("401 - User not found"));
    console.log("HERE", price);
    if (user.balance >= price.total) {
      const user = await User.findByIdAndUpdate(
        { _id: userId },
        { $inc: { balance: -price.total } },
        { new: true }
      );

      const order = await Order.findByIdAndUpdate(
        { _id: orderId },
        { status: "paid" },
        { new: true }
      );
      utilsHelper.sendResponse(
        res,
        200,
        true,
        { user, order },
        null,
        "User balance updated"
      );
    } else {
      return next(new Error("401 - Insufficient balance, please top up"));
    }
  } catch (error) {
    next(error);
  }
};
module.exports = userController;
