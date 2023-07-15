const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { body, param } = require("express-validator");
const validators = require("../middleware/validators");
const authentication = require("../middleware/authentication");

/**
 * @route POST/users
 * @description register new user
 * @body {name, email,password}
 * @access Public
 */
router.post(
  "/",
  validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  userController.register
);

/**
 * @route GET/users/page=1&limit=10
 * @description get users with pagination
 * @access Login required
 */
router.get("/", authentication.loginRequired, userController.getUsers);

/**
 * @route GET/users/me
 * @description get current user info
 * @access login required
 */
router.get("/me", authentication.loginRequired, userController.getCurrentUser);
/**
 * @route GET/users/:id
 * @description get a user profile
 * @access Login required
 */
router.get(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.getSingleUser
);
/**
 * @route PUT/users/:id
 * @description Update user Profile
 * @body {name, avatar, coverUrl,city,country, ........}
 * @access Login required.
 */
router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.updateProfile
);

module.exports = router;
