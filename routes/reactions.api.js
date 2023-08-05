const express = require("express");
const authentication = require("../middleware/authentication");
const validators = require("../middleware/validators");
const reactionController = require("../controllers/reaction.controller");
const { body } = require("express-validator");
const router = express.Router();

/**
 * @route POST/reactions
 * @description Save a reaction to post or comment
 * @body {targetType:"Post", "Comment", targetId, emoji:"like" or "dislike"}
 * @access Login required
 */
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("targetType", "Invalid targetType").exists().isIn(["Post", "Comment"]),
    body("targetId", "Invalid targetId")
      .exists()
      .custom(validators.checkObjectId),
    body("emoji", "Invalid emoji").exists().isIn(["like", "dislike"]),
  ]),
  reactionController.saveReaction
);
module.exports = router;
