const { UnauthenticatedError } = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  const isAdmin = requestUser.role === "admin";
  const isOwner = requestUser.userId === resourceUserId;

  if (isAdmin || isOwner) return;

  throw new UnauthenticatedError("Unauthorized to access this route");
};

module.exports = checkPermissions;
