const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
} = require("../utils");

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

  if (!user.isVerified) {
    throw new UnauthenticatedError("Please verify your email");
  }

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, payload: tokenUser });

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

  const verificationToken = crypto.randomBytes(44).toString("hex");

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  // send email
  sendVerificationEmail(name, email, verificationToken);

  res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email to verify your account",
    verificationToken,
  });
};

const logoutUser = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "User logged out" });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.query;

  if (!verificationToken || !email)
    throw new BadRequestError("Invalid email or token");

  const user = await User.findOneAndUpdate(
    { email, verificationToken },
    {
      isVerified: true,
      verificationToken: "",
      varifiedAt: new Date(),
    },
    { new: true }
  );
  if (!user) {
    throw new BadRequestError(
      "Invalid1 email or token or Email already verified"
    );
  }

  res.status(StatusCodes.OK).json({ msg: "Account verified" });
};

module.exports = { loginUser, registerUser, logoutUser, verifyEmail };
