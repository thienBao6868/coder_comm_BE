var express = require("express");
var router = express.Router();

//authApi
const authApi = require("./auth.api");
router.use("/auth", authApi);
//usersApi
const usersApi = require("./users.api");
router.use("/users", usersApi);
//postsApi
const postsApi = require("./posts.api");
router.use("/posts", postsApi);
//commentsApi
const commentsApi = require("./comments.api");
router.use("/comments", commentsApi);
//reactionsApi
const reactionsApi = require("./reactions.api");
router.use("/reactions", reactionsApi);
//friendsApi
const friendsApi = require("./friends.api");
router.use("./friends", friendsApi);

module.exports = router;

/**
 * @route POST/auth/Login
 *
 * @route POST/users
 * @route GET/users/page=1&limit=10
 * @route GET/users/me
 * @route GET/users/:id
 * @route PUT/users/:id
 *
 * @route GET/posts/user/:userId/page=1&limit=10
 *  @route POST/posts
 * @route PUT/posts/:postId
 * @route Delete/posts/:postId
 * @route GET/posts/:postId
 * @route GET/posts/:postId/comments
 *
 * @route POST/comments
 * @route PUT/comments/:commentId
 * @route Delete/comments/:commentId
 * @route GET/comments/:commentId
 *
 * @route POST/reactions
 *
 * @route POST/friends/requests
 * @route GET/friends/requests/incoming
 * @route GET/friends/requests/outgoing
 * @route Get/friends
 *  @route PUT/friends/requests/:userId
 * @route DELETE/friends/requests/:userId
 * @route DELETE/friends/:userId
 */
