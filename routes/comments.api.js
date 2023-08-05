const express = require("express");
const authentication = require("../middleware/authentication");
const validators = require("../middleware/validators");
const { body, param } = require("express-validator");
const commentController = require("../controllers/comment.controller");
const router = express.Router();

/**
 * @route POST/comments
 * @description Create a new comment
 * @body {content, postId}
 * @access Login required
 */
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("content", "Missing Content").exists().notEmpty(),
    body("postId", "Missing postId")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
  ]),
  commentController.createNewComment
);

/**
 * @route PUT/comments/:commentId
 * @description Update a comment
 * @body {content}
 * @access Login required
 */
router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("content", "Missing content").exists().notEmpty(),
  ]), 
  commentController.updateSingleComment
);
/**
 * @route Delete/comments/:commentId
 * @description Delete a comment
 * @access Login required
 */
router.delete(
    "/:id",
    authentication.loginRequired,
    validators.validate([
      param("id").exists().isString().custom(validators.checkObjectId),
    ]), 
    commentController.deleteSingleComment
  );
/**
 * @route GET/comments/:commentId
 * @description Get detail of a comment
 * @access Login required
 */
router.get(
    "/:id",
    authentication.loginRequired,
    validators.validate([
      param("id").exists().isString().custom(validators.checkObjectId),
    ]), 
    commentController.getSingleComment
  );
module.exports = router;
