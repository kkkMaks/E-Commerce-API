const { StatusCodes } = require("http-status-codes");

const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");

const User = require("../models/User");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-__v");

  res.status(StatusCodes.OK).json({ amount: users.length, users });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById({ _id: id }).select("-__v");

  if (!user) {
    throw new NotFoundError(`No user with id : ${id}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  const { user } = req;
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  if (!name && !email) {
    throw new BadRequestError("Please provide name or email");
  }

  if (role === "admin") {
    throw new BadRequestError("Only admin can change role");
  }

  const user = await User.findByIdAndUpdate(
    { _id: id },
    { name, email, role },
    { new: true, runValidators: true }
  ).select("-__v");

  if (!user) {
    throw new NotFoundError(`No user with id : ${id}`);
  }

  res.status(StatusCodes.OK).json({ user });
};

const updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword1, newPassword2 } = req.body;

  const user = await User.findById({ _id: id }).select("+password");

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  if (newPassword1 !== newPassword2) {
    throw new BadRequestError("Passwords do not match");
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
