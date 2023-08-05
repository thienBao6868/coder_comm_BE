const express = require("express");
const authentication = require("../middleware/authentication");
const validators = require("../middleware/validators");
const { body, param } = require("express-validator");
const postController = require("../controllers/post.controller");

const router = express.Router();

/**
 * @route GET/posts/user/:userId/page=1&limit=10
 * @description Get all posts an user can see with pagination
 * @access Login required
 */
router.get(
  "/user/:userId",
  authentication.loginRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.getPosts
);
/**
 * @route POST/posts
 * @description Create a new Post
 * @body {content, image}
 * @access Login required
 */
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([body("content", "Missing Content").exists().notEmpty()]),
  postController.createNewPost
);
/**
 * @route PUT/posts/:postId
 * @description Update a post
 * @body {content, image}
 * @access Login required
 */
router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.updateSinglePost
);
/**
 * @route Delete/posts/:postId
 * @description Delete a post
 * @access Login required
 */
router.delete(
    "/:id",
    authentication.loginRequired,
    validators.validate([
      param("id").exists().isString().custom(validators.checkObjectId),
    ]),
    postController.deleteSinglePost
  );
/**
 * @route GET/posts/:postId
 * @description Get a single post
 * @access Login required
 */
router.get(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.getSinglePost
);
/**
 * @route GET/posts/:postId/comments
 * @description Create comment of a post
 * @access Login required
 */
router.get(
  "/:id/comments",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.getCommentsOfPost
);
module.exports = router;
