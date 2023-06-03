require("dotenv").config();
const jwt = require("jsonwebtoken");

const isTokenValid = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const attachCookiesToResponse = ({ res, payload, refreshToken }) => {
  const accessTokenJWT = createToken({ user: payload });
  const refreshTokenJWT = createToken({ user: payload, refreshToken });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay * 7),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = { isTokenValid, createToken, attachCookiesToResponse };
