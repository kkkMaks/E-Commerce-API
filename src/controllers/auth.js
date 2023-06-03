const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const Token = require("../models/Token");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
  generateRandomToken,
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

  let refreshToken = "";
  const existingToken = await Token.findOne({ user: user._id });
  const tokenUser = createTokenUser(user);

  if (existingToken && existingToken.isValid) {
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, payload: tokenUser, refreshToken });
    return res.status(200).json({ msg: "Success! User logged in" });
  }

  refreshToken = generateRandomToken();
  const ip = req.ip;
  const userAgent = req.get("user-agent");

  await Token.create({
    refreshToken,
    ip,
    userAgent,
    isValid: true,
    user: user._id,
  });
  attachCookiesToResponse({ res, payload: tokenUser, refreshToken });

  res.status(200).json({ msg: "Success! User logged in" });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const isEmailExist = await User.findOne({ email });

  if (isEmailExist) {
    throw new BadRequestError("This email already exists");
  }

  const isFirstAccount = (await User.countDocuments()) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const verificationToken = generateRandomToken();
  const resetPasswordToken = generateRandomToken();

  await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
    resetPasswordToken,
  });

  // send email
  await sendVerificationEmail(name, email, verificationToken);

  res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email to verify your account",
  });
};

const logoutUser = async (req, res) => {
  await Token.deleteMany({ user: req.user.userId });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "User logged out" });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;

  if (!verificationToken || !email)
    throw new BadRequestError("Invalid email or token");

  const user = await User.findOneAndUpdate(
    { email, verificationToken },
    {
      isVerified: true,
      verificationToken: null,
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

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) throw new BadRequestError("Please provide email");

  const user = await User.findOne({ email });

  if (user) {
    const resetPasswordToken = generateRandomToken();
    const tenMinutes = 1000 * 60 * 10;
    const resetPasswordTokenExpire = new Date(Date.now() + tenMinutes);

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordTokenExpire = resetPasswordTokenExpire;
    sendResetPasswordEmail(user.name, email, resetPasswordToken);
    await user.save();
  }

  res.status(StatusCodes.OK).json({ msg: "Check your email for reset link " });
};

const resetPassword = async (req, res) => {
  const { resetPasswordToken, email, password1, password2 } = req.body;

  if (!resetPasswordToken || !email || !password1 || !password2) {
    throw new BadRequestError(
      "Please provide all fields (token, email, password1, password2)"
    );
  }
  if (password1 !== password2) {
    throw new BadRequestError("Password does not match");
  }
  const user = await User.findOne({
    email,
    resetPasswordToken,
  });

  if (!user) throw new BadRequestError("Invalid1 email or token ");
  if (user.resetPasswordTokenExpire < Date.now()) {
    throw new BadRequestError("Reset password token expired");
  }

  user.password = password1;
  user.resetPasswordToken = null;
  user.resetPasswordTokenExpire = null;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password changed" });
};

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
