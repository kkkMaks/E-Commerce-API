const {
  isTokenValid,
  createToken,
  attachCookiesToResponse,
} = require("../utils/jwt");
const createTokenUser = require("../utils/createTokenUser");
const checkPermissions = require("../utils/checkPermissions");
const {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
} = require("../utils/sendEmail");

module.exports = {
  isTokenValid,
  createToken,
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
