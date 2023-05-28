const { UnauthenticatedError, UnauthorizedError } = require("../errors");
const { isTokenValid } = require("../utils/jwt");

const authenticatedUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  try {
    const { userId, name, role } = isTokenValid(token);
    req.user = { userId, name, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

const authorizeAdminPermissions = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new ForbiddenError("Only admins can access this route");
  }
  next();
};

module.exports = { authenticatedUser, authorizeAdminPermissions };
