const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const { BadRequestError, UnauthenticatedError } = require("../errors");
const { attachCookiesToResponse } = require("../utils/jwt");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email }, "+password");
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const payload = { userId: user._id, name: user.name, role: user.role };

  attachCookiesToResponse({ res, payload });

  res.status(200).json({ user });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const isEmailExist = await User.findOne({ email });

  if (isEmailExist) {
    throw new BadRequestError("This email already exists");
  }

  const isFirstAccount = (await User.countDocuments()) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  const tokenUser = { userId: user._id, name: user.name, role: user.role };

  attachCookiesToResponse({ res, payload: tokenUser });

  res.status(StatusCodes.CREATED).json({ user });
};

const logoutUser = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "User logged out" });
};

module.exports = { loginUser, registerUser, logoutUser };
