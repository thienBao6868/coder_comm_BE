const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Friend = require("../models/Friend");

const postController = {};

const caculatePostCount = async (userId) => {
  const postCount = await Post.countDocuments({
    author: userId,
    isDeleted: false,
  });
  await User.findByIdAndUpdate(userId, { postCount });
};

postController.createNewPost = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { content, image } = req.body;

  let post = await Post.create({
    content,
    image,
    author: currentUserId,
  });
  await caculatePostCount(currentUserId);
  post = await post.populate("author");

  sendResponse(res, 200, true, post, null, "Create Post Successfully");
});

postController.updateSinglePost = catchAsync(async (req, res, next) => {
  // get data from request
  const currentUserId = req.userId;
  const postId = req.params.id;
  // business logic validation

  let post = await Post.findById(postId);
  if (!post) throw new AppError("400", "Post not found", " Update Post Error");
  if (!post.author.equals(currentUserId))
    throw new AppError(400, "Only author can edit post", "Update Post Error");
  // Process

  const allows = ["content", "image"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      post[field] = req.body[field];
    }
  });
  await post.save();

  //Response
  sendResponse(res, 200, true, post, null, "update Post Successfully");
});

postController.getSinglePost = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const postId = req.params.id;

  let post = await Post.findById(postId);
  if (!post)
    throw new AppError("400", "Post not found", " Get single Post Error");

  post = post.toJSON(); // chuyển post thành post.toJSON trước khi gán comments vào post???
  //   console.log(post,"test 1")
  post.comments = await Comment.find({ post: post._id }).populate("author");

  sendResponse(res, 200, true, post, null, "Get single Post successfully");
});

// chinh sua *****
postController.getPosts = catchAsync(async (req, res, next) => {
  // get data from request
  const currentUserId = req.userId;
  const userId = req.params.userId;
  let { page, limit, ...filter } = { ...req.query };
  // business logic validation
  // Process
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  let userFriendIds = await Friend.find({
    $or: [{ from: userId }, { to: userId }],
    status: "accepted",
  });
  if (userFriendIds && userFriendIds.length) {
    userFriendIds = userFriendIds.map((friend) => {
      if (friend.from._id.equals(userId)) return friend.to;
      return friend.from;
    });
  } else {
    userFriendIds = [];
  }

  userFriendIds = [...userFriendIds, userId];

  const filterConditions = [
    { isDeleted: false },
    { author: { $in: userFriendIds } },
  ];

  const filterCriterial = filterConditions.length
    ? { $and: filterConditions }
    : {};

  let count = await Post.countDocuments(filterCriterial);

  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);
  let posts = await Post.find(filterCriterial)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");

  //Response
  sendResponse(
    res,
    200,
    true,
    { posts, totalPage, count },
    null,
    "Get List User successful"
  );
});

postController.deleteSinglePost = catchAsync(async (req, res, next) => {
  // get data from request
  const currentUserId = req.userId;
  const postId = req.params.id;
  // business logic validation

  let post = await Post.findByIdAndUpdate(
    { _id: postId },
    { isDeleted: true },
    { new: true }
  );
  if (!post)
    throw new AppError(
      "400",
      "Post not found or User not Authorized",
      " Delete Post Error"
    );

  await caculatePostCount(currentUserId);
  // Process

  //Response
  sendResponse(res, 200, true, post, null, "Deleted Post Successfully");
});

postController.getCommentsOfPost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // validate post exists
  let post = await Post.findById(postId);
  if (!post) throw new AppError("400", "Post not found", " Get comments Error");
  //Get comments

  const count = await Comment.countDocuments({ post: postId });
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");

  sendResponse(
    res,
    200,
    true,
    { comments, totalPage, count },
    null,
    "Get comments sucessfully"
  );
});

module.exports = postController;
