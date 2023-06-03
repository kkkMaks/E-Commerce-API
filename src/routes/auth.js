const express = require("express");
const {
  loginUser,
  registerUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");
const { authenticatedUser } = require("../middleware/authentication");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/logout", authenticatedUser, logoutUser);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", authenticatedUser, resetPassword);

module.exports = router;
