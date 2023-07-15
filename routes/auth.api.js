const express = require("express");
const router = express.Router()
const authController = require("../controllers/auth.controller");
const { body } = require("express-validator");
const validators = require("../middleware/validators");

/**
 * @route POST/auth/Login
 * @description login with email and password
 * @body {email,password}
 * @access Public
 */
router.post(
  "/login",
  validators.validate([
    body("email", "invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  authController.loginWithEmail
);

module.exports = router;
