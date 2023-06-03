const { UnauthenticatedError, UnauthorizedError } = require("../errors");
const Token = require("../models/Token");
const { isTokenValid } = require("../utils/jwt");
const { attachCookiesToResponse } = require("../utils");

const authenticatedUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  if (accessToken) {
    const payload = isTokenValid(accessToken);
    if (!payload) {
      throw new UnauthenticatedError("Invalid token");
    }

    req.user = payload.user;
    return next();
  }

  if (!refreshToken) {
    throw new UnauthenticatedError("Token has expired or is invalid");
  }
  const payload = isTokenValid(refreshToken);

  if (!payload) {
    throw new UnauthenticatedError("Token has expired or is invalid");
  }

  const existingRefreshToken = await Token.findOne({
    user: payload.user.userId,
    refreshToken: payload.refreshToken,
  });

  if (!existingRefreshToken || !existingRefreshToken.isValid) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  attachCookiesToResponse({
    res,
    payload: payload.user,
    refreshToken: existingRefreshToken.refreshToken,
  });

  req.user = payload.user;
  next();
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};

module.exports = { authenticatedUser, authorizePermissions };
