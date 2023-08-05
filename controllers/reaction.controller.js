const mongoose = require("mongoose");
const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Reaction = require("../models/Reaction");
const reactionController = {};

const calculateReactions = async (targetId, targetType) => {
  const stats = await Reaction.aggregate([
    { $match: { targetId: new mongoose.Types.ObjectId(targetId) } },
    {
      $group: {
        _id: "$targetId",
        like: {
          $sum: {
            $cond: [{ $eq: ["$emoji", "like"] }, 1, 0],
          },
        },
        dislike: {
          $sum: {
            $cond: [{ $eq: ["$emoji", "dislike"] }, 1, 0],
          },
        },
      },
    },
  ]);
  const reactions = {
    like: (stats[0] && stats[0].like) || 0,
    dislike: (stats[0] && stats[0].dislike) || 0,
  };
  await mongoose.model(targetType).findByIdAndUpdate(targetId, { reactions });
  return reactions;
};

reactionController.saveReaction = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { targetType, targetId, emoji } = req.body;

  //check targetType exists
  // trong schema cua reaction field targetType duoc luu voi 2 gia tri "Post" hoac "Comment"
  // dang ra phai viet logic loc ra nhung ben duoi co syntax cua mongoose cho phep loc nhanh

  const targetObj = await mongoose.model(targetType).findById(targetId);
  if (!targetObj)
    throw new AppError(400, `${targetType} not found`, "create Reaction Error");
  //Find reaction if exists
  let reaction = await Reaction.findOne({
    targetType,
    targetId,
    author: currentUserId,
  });

  //If there is no reaction in the DB => create a new one
  if (!reaction) {
    reaction = await Reaction.create({
      targetType,
      targetId,
      author: currentUserId,
      emoji,
    });
  } else {
    // if there is a previous reaction in the DB => compare the emoji
    if (reaction.emoji === emoji) {
      // If they are the same => delete the reaction
      await Reaction.findOneAndDelete({
        targetType,
        targetId,
        author: currentUserId,
      });
    } else {
      // If they are different => update the reaction
      reaction.emoji = emoji;
      await reaction.save();
    }
  }
  const reactions = await calculateReactions(targetId, targetType);
  return sendResponse(
    res,
    200,
    true,
    reactions,
    null,
    "Save reaction Successfully"
  );
});

module.exports = reactionController;
