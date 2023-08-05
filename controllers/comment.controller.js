const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const commentController = {};

const caculateCommentCount = async (postId) => {
  const commentCount = await Comment.countDocuments({
    post: postId,
  });
  await Post.findByIdAndUpdate(postId, { commentCount });
};

commentController.createNewComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { content, postId } = req.body;
  // check post exists
  const post = await Post.findById(postId);
  if (!post)
    throw new AppError(400, "Post not found", "Create new comment error");
  //create new comment
  let comment = await Comment.create({
    author: currentUserId,
    post: postId,
    content,
  });
  // update commentCount of the post
  await caculateCommentCount(postId);
  comment = await comment.populate("author");

  sendResponse(
    res,
    200,
    true,
    { comment },
    null,
    "create new comment successfully"
  );
});

commentController.updateSingleComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const commentId = req.params.id;
  const { content } = req.body;

  const comment = await Comment.findByIdAndUpdate(
    { _id: commentId, author: currentUserId },
    { content },
    { new: true }
  );

  if (!comment)
    throw new AppError(
      400,
      "Comment not found or User not authorized",
      "Update Comment Error"
    );

  sendResponse(res, 200, true, comment, null, "update comment Successfully");
});
commentController.deleteSingleComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const commentId = req.params.id;

  const comment = await Comment.findByIdAndDelete({
    _id: commentId,
    author: currentUserId,
  });

  if (!comment)
    throw new AppError(
      400,
      "Comment not found or User not authorized",
      "Delete Comment Error"
    );
  await caculateCommentCount(comment.post);

  sendResponse(res, 200, true, comment, null, "Delete comment Successfully");
});

commentController.getSingleComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const commentId = req.params.id;

  const comment = await Comment.findById(commentId);

  if (!comment)
    throw new AppError(
      400,
      "Comment not found or User not authorized",
      "Get Comment Error"
    );

  sendResponse(res, 200, true, comment, null, "Get comment Successfully");
});

module.exports = commentController;
