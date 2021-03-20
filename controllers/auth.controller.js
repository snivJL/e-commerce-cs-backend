const utilsHelper = require("../helpers/utils.helper");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { Error } = require("mongoose");

let authController = {};

authController.loginWithEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    user = await User.findOne({ email });
    if (!user) return next(new Error("401 - Email not found"));

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) return next(new Error("401 - Wrong password"));

    const token = await user.generateToken();
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user, token },
      null,
      "User logged in"
    );
  } catch (error) {
    next(error);
  }
};

authController.loginWithSocial = async ({ user }, res) => {
  if (user) {
    user = await User.findByIdAndUpdate(
      user._id,
      { avatarUrl: user.avatarUrl },
      { new: true }
    );
  } else {
    let newPassword = "" + Math.floor(Math.random() * 100000000);
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);

    user = await User.create({
      name: user.name,
      email: user.email,
      password: newPassword,
      avatarUrl: user.avatarUrl,
    });
  }
  const accessToken = await user.generateToken();
  res.send({ user, accessToken });
};

module.exports = authController;
