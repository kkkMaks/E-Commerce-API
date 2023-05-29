const { StatusCodes } = require("http-status-codes");

const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
} = require("../utils");

const User = require("../models/User");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-__v");

  res.status(StatusCodes.OK).json({ amount: users.length, users });
};

const getSingleUser = async (req, res) => {
  const reqId = req.params.id;

  const user = await User.findById({ _id: reqId }).select("-__v");

  if (!user) {
    throw new NotFoundError(`No user with id : ${reqId}`);
  }
  checkPermissions(req.user, reqId);

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  const { user } = req;
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  const { userId: id } = req.user;
  const { name, email } = req.body;

  if (!name || !email) {
    throw new BadRequestError("Please provide name and email");
  }

  const user = await User.findByIdAndUpdate(
    { _id: id },
    { name, email },
    { new: true, runValidators: true }
  ).select("-__v");

  if (!user) {
    throw new NotFoundError(`No user with id : ${id}`);
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, payload: tokenUser });

  res.status(StatusCodes.OK).json({ user });
};

const updateUserPassword = async (req, res) => {
  const { userId: id } = req.user;
  const { oldPassword, newPassword1, newPassword2 } = req.body;

  const user = await User.findById({ _id: id }).select("+password");

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Old password is incorrect");
  }

  if (newPassword1 !== newPassword2) {
    throw new BadRequestError("New passwords do not match");
  }

  if (oldPassword === newPassword1) {
    throw new BadRequestError(
      "New password cannot be the same as old password"
    );
  }

  user.password = newPassword1;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password updated" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
