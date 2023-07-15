const bcrypt = require("bcryptjs");
const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const User = require("../models/User");
const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  // get data from request
  const { email, password } = req.body;
  // business logic validation
  const user = await User.findOne({ email }, "+password");
  if (!user) throw new AppError(400, "invalid credentials", "Login Error");

  // Process
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) throw new AppError(400, "Wrong Password", "Login Error");
  const accessToken = await user.generateToken();

  //Response
  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login with Email successful"
  );
});
module.exports = authController;
