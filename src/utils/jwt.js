require("dotenv").config();
const jwt = require("jsonwebtoken");

const isTokenValid = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

const attachCookiesToResponse = ({ res, payload }) => {
  const token = createToken(payload);

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = { isTokenValid, createToken, attachCookiesToResponse };
