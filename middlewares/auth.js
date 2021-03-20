const mongoose = require("mongoose");
const authController = require("../controllers/auth.controller");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authMiddleware = {};

authMiddleware.loginRequired = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;

    if (!tokenString) return next(new Error("401 - Access Token Required"));

    const token = tokenString.replace("Bearer ", "");

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError")
          return next(new mongoose.Error("401 - Token expired"));
        else if (err.name === "TokenExpiredError")
          return next(new Error("401 - Token is invalid"));
      }
      console.log(decoded);
      req.userId = decoded._id;
      console.log(req.userId);
      next();
    });
  } catch (error) {
    next(error);
  }
};

authMiddleware.adminRequired = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) return next(new Error("401 - User not found"));

    if (user.role !== "admin")
      return next(new Error("401 - Admin access required"));

    next();
  } catch (error) {
    next(error);
  }
};
module.exports = authMiddleware;
