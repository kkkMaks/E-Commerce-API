const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const { BadRequestError, UnauthenticatedError } = require("../errors");
const { createToken } = require("../utils/jwt");

const loginUser = async (req, res) => {
  return res.status(200).json({ msg: "Login user route" });
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
  const token = createToken(tokenUser);

  return res.status(StatusCodes.CREATED).json({ user, token });
};

const logoutUser = async (req, res) => {
  return res.status(200).json({ msg: "Logout user route" });
};

module.exports = { loginUser, registerUser, logoutUser };
