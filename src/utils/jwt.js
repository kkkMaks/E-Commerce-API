require("dotenv").config();
const jwt = require("jsonwebtoken");

const isTokenValid = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const createToken = (payload) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

module.exports = { isTokenValid, createToken };
