const express = require("express")
const router = express.Router()


/**
 * @route GET/posts/user/:userId/page=1&limit=10
 * @description Get all posts an user can see with pagination
 * @access Login required
 */

/**
 * @route POST/posts
 * @description Create a new Post
 * @body {content, image}
 * @access Login required
 */

/**
 * @route PUT/posts/:postId
 * @description Update a post
 * @body {content, image}
 * @access Login required
 */

/**
 * @route Delete/posts/:postId
 * @description Delete a post 
 * @access Login required
 */

/**
 * @route GET/posts/:postId
 * @description Get single post
 * @access Login required
 */

/**
 * @route GET/posts/:postId/comments
 * @description Create comment of a post
 * @access Login required
 */

module.exports = router