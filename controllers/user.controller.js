const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const User = require("../models/User");
const Friend = require("../models/Friend");
const bcrypt = require("bcryptjs");

const userController = {};
userController.register = catchAsync(async (req, res, next) => {
  // get data from request
  let { name, email, password } = req.body;
  // business logic validation
  let user = await User.findOne({ email });
  if (user)
    throw new AppError("400", "User already exists", " Registration Error");

  // Process
  const salt = bcrypt.genSaltSync(10);
  password = bcrypt.hashSync(password, salt);

  user = await User.create({ name, email, password });

  const accessToken = await user.generateToken();

  //Response
  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create user successful"
  );
});

userController.getUsers = catchAsync(async (req, res, next) => {
  // get data from request
  const currentUserId = req.userId;
  let { page, limit, ...filter } = { ...req.query };
  // business logic validation
  // Process
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filterConditions = [{ isDeleted: false }];
  if (filter.name) {
    filterConditions.push({ name: { $regex: filter.name, $options: "i" } });
  }

  const filterCriterial = filterConditions.length
    ? { $and: filterConditions }
    : {};
  let count = await User.countDocuments(filterCriterial);

  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);
  let users = await User.find(filterCriterial)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  const promises = users.map(async (user) => {
    let temp = user.toJSON();
    temp.friendship = await Friend.findOne({
      $or: [
        { from: currentUserId, to: user._id },
        { from: user._id, to: currentUserId },
      ],
    });
    return temp;
  });
  const usersWithFriendship = await Promise.all(promises);
  //Response
  sendResponse(
    res,
    200,
    true,
    { users, totalPage, count },
    null,
    "Get List User successful"
  );
});
userController.getCurrentUser = catchAsync(async (req, res, next) => {
  // get data from request
  const currentUserId = req.userId;
  // business logic validation
  const user = await User.findById(currentUserId);
  if (!user)
    throw new AppError("400", "User not found", " Get current User Error");
  // Process
  //Response
  sendResponse(res, 200, true, user, null, "Get current User Successful");
});
userController.getSingleUser = catchAsync(async (req, res, next) => {
  // get data from request
  const currentUserId = req.userId;
  const userId = req.params.id;
  // business logic validation
  let user = await User.findById(userId);
  if (!user)
    throw new AppError("400", "User not found", " Get Single User Error");
  // Process
  user = user.toJSON();
  user.friendship = await Friend.findOne({
    $or: [
      { from: currentUserId, to: user._id },
      { from: user._id, to: currentUserId },
    ],
  });

  //Response
  sendResponse(res, 200, true, user, null, "Get Single User Successful");
});
userController.updateProfile = catchAsync(async (req, res, next) => {
  // get data from request
  const currentUserId = req.userId;
  const userId = req.params.id;
  // business logic validation
  if (currentUserId !== userId)
    throw new AppError(400, "Permission required", "Update Error");
  let user = await User.findById(userId);
  if (!user) throw new AppError("400", "User not found", " Update User Error");
  // Process
  const allows = [
    "name",
    "avartarUrl",
    "coverUrl",
    "aboutMe",
    "city",
    "country",
    "company",
    "jobTitle",
    "facebookLink",
    "instagramLink",
    "linkedinLink",
    "twitterLink",
  ];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });
  await user.save();

  //Response
  sendResponse(res, 200, true, user, null, "update User User Successful");
});

module.exports = userController;

// get data from request
// business logic validation
// Process
//Response
