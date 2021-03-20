const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const passport = require("passport");

/**
 * @route POST api/auth
 * @description User can Login with email
 * @access Public
 */
router.post("/", authController.loginWithEmail);

/**
 * @route POST api/auth/login/google
 * @description User can Login with email
 * @access Public
 */
router.post(
  "/google",
  passport.authenticate("google-token", { session: false }),
  authController.loginWithSocial
);

/**
 * @route POST api/auth/login/facebook
 * @description User can Login with email
 * @access Public
 */
router.post(
  "/facebook",
  passport.authenticate("facebook-token", { session: false }),
  authController.loginWithSocial
);

module.exports = router;
